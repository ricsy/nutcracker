#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getVersion() {
  const args = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
  if (args.length === 0) {
    console.error('Usage: node release.js <version>');
    process.exit(1);
  }
  return args[0];
}

function hasPackageJson() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  return fs.existsSync(pkgPath);
}

function updatePackageJson(version) {
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Updated package.json to ${version}`);
  return true;
}

function gitCommit(version, files = []) {
  const status = execSync('git status --porcelain').toString().trim();
  if (!status) {
    console.log('No changes to commit');
    return false;
  }

  if (files.length > 0) {
    const existingFiles = files.filter(f => fs.existsSync(f));
    if (existingFiles.length > 0) {
      execSync(`git add ${existingFiles.join(' ')}`, { stdio: 'inherit' });
    }
  } else {
    execSync('git add -A', { stdio: 'inherit' });
  }

  execSync(`git commit -m "release: bump version to ${version}"`, { stdio: 'inherit' });
  console.log(`Committed version bump to ${version}`);
  return true;
}

function gitTag(version) {
  const tag = version.startsWith('v') ? version : `v${version}`;
  execSync(`git tag -a ${tag} -m "Release ${tag}"`, { stdio: 'inherit' });
  execSync(`git push origin ${tag}`, { stdio: 'inherit' });
  console.log(`Pushed tag ${tag}`);
}

function run() {
  const version = getVersion();
  let changed = false;

  if (hasPackageJson()) {
    updatePackageJson(version);
    changed = true;
  } else {
    console.log('No package.json found, skipping version update');
  }

  gitCommit(version);
  gitTag(version);

  console.log(`\nRelease ${version} created successfully!`);
}

run();
