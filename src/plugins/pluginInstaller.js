// Turns a GitHub repo URL into the plugin's raw files, and validates them.
// This is the "download" half of the plugin system — registry.js and
// plugins.json (the old bundled-import approach) are no longer used.

// Accepts:
//   https://github.com/owner/repo
//   https://github.com/owner/repo/tree/branch
//   github.com/owner/repo
//   owner/repo
export function parseGithubUrl(input) {
  const trimmed = String(input).trim().replace(/\/+$/, "");

  const treeMatch = trimmed.match(
    /github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)/i,
  );
  if (treeMatch) {
    return { owner: treeMatch[1], repo: treeMatch[2], branch: treeMatch[3] };
  }

  const repoMatch = trimmed.match(/(?:github\.com\/)?([^/\s]+)\/([^/\s]+)$/);
  if (repoMatch) {
    return { owner: repoMatch[1], repo: repoMatch[2], branch: null };
  }

  throw new Error("That doesn't look like a GitHub repo URL");
}

function rawUrl({ owner, repo, branch }, path) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.text();
}

// Tries `main`, then falls back to `master` — most new repos use main,
// but plenty of older ones still default to master.
async function resolveBranch(location) {
  if (location.branch) return location.branch;

  for (const candidate of ["main", "master"]) {
    const text = await fetchText(
      rawUrl({ ...location, branch: candidate }, "config.json"),
    );
    if (text !== null) return candidate;
  }

  throw new Error("Couldn't find config.json on main or master");
}

// Fetches and validates a plugin from its GitHub URL.
// Returns { name, version, description, code, sourceUrl }.
export async function fetchPlugin(githubUrl) {
  const location = parseGithubUrl(githubUrl);
  const branch = await resolveBranch(location);
  const full = { ...location, branch };

  const configText = await fetchText(rawUrl(full, "config.json"));
  if (!configText) {
    throw new Error("Repo has no config.json at its root");
  }

  let config;
  try {
    config = JSON.parse(configText);
  } catch {
    throw new Error("config.json isn't valid JSON");
  }

  if (!config.name || !config.version) {
    throw new Error("config.json must include at least name and version");
  }

  const entryFile = config.main || "index.js";
  const code = await fetchText(rawUrl(full, entryFile));
  if (!code) {
    throw new Error(`Couldn't fetch ${entryFile} from the repo`);
  }

  return {
    name: config.name,
    version: config.version,
    description: config.description || "",
    code,
    sourceUrl: `https://github.com/${location.owner}/${location.repo}`,
  };
}