
# Armory3D Github Actions

This action sets up a [Armory3D](https://github.com/armory3d/armory) environment for use in your github workflows.


## Usage

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: tong/armory_gh_action@v0.0.0
        with:
            blend: "project.blend"
            targets: '["html5","krom"]'
```

[![test](https://github.com/tong/armory_gh_actions/actions/workflows/test.yml/badge.svg)](https://github.com/tong/armory_gh_actions/actions/workflows/test.yml)
