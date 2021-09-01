# Armory3D Github Actions

[![test](https://github.com/tong/armory_gh_actions2/actions/workflows/test.yml/badge.svg)](https://github.com/tong/armory_gh_actions/actions/workflows/test.yml)

This action sets up a [Armory3D](https://github.com/armory3d/armory) environment to build your project in your github workflows.


## Usage

### Build project
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: tong/armory_gh_action@v0.34.0
        with:
            blend: project.blend
```

### Export project using specified exporter (exporter name)
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: tong/armory_gh_action@v0.34.0
        with:
            blend: project.blend
            exporter: html5
```

#### Inputs

Various inputs are defined in [`action.yml`](action.yml) to let you configure the build:

| Name | Description | Default |
| - | - | - |
| `blend` | Main blend file | N/A |
| `exporter` | Exporter name | N/A |
| `armsdk_repository` | Path to the armsdk repository | `https://github.com/armory3d/armsdk`
| `armory_version` | Armory version to use | `master`

snap info blender



#### Outputs
| Name | Description | Default |
| - | - | - |
| `code` | Exit code | 0 |
