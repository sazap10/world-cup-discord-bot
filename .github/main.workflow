workflow "Build and deploy on push" {
  on = "push"
  resolves = ["Remove old instances"]
}

action "Only run on master branch" {
  uses = "actions/bin/filter@b2bea07"
  args = "branch master"
}

action "Deploy" {
  uses = "actions/zeit-now@9fe84d5"
  needs = ["Only run on master branch"]
  args = "--regions bru"
  secrets = ["ZEIT_TOKEN"]
}

action "Alias" {
  uses = "actions/zeit-now@9fe84d5"
  needs = ["Deploy"]
  args = "alias"
  secrets = ["ZEIT_TOKEN"]
}

action "Remove old instances" {
  uses = "actions/zeit-now@9fe84d5"
  needs = ["Alias"]
  args = "rm world-cup-discord-bot --safe --yes"
  secrets = ["ZEIT_TOKEN"]
}

