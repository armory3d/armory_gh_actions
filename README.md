# Armory3D Github Actions

[![build](https://github.com/tong/armory_gh_actions/actions/workflows/build.yml/badge.svg)](https://github.com/tong/armory_gh_actions/actions/workflows/build.yml)

This action sets up a [blender](https://www.blender.org/)/[armory](https://github.com/armory3d/armory) environment to build projects in your github workflows.

---

## Inputs

| Name | Description | Required | Default |
| - | - | - | - |
| `blend` | Main blend file | Yes | N/A |
| `export` | Publish exporter name | No | The default exporter is used if undefined |
| `build` | Build exporter name | No | The default exporter is used if undefined |
| `blender` | Blender version ([snap](https://snapcraft.io/blender)) | No | latest/stable |
| `armsdk` | armsdk ref | No | `master`
| `armsdk_repository` | Path to the armsdk repository | No | `https://github.com/armory3d/armsdk`


## Outputs

| Name | Description | Default |
| - | - | - |
| `code` | Exit code | 0 |
| `stdout` | Process stdout |  |
| `stderr` | Process stderr |  |
| `time` | Build time ms | |

---

## Examples

Build project with active exporter:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: tong/armory_gh_action@v0.1.0
        with:
            blend: project.blend
```

Set the exporter to use (preset name):
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: tong/armory_gh_action@v0.1.0
        with:
          blender: latest/candidate
          armsdk: 21.08
          blend: awesome.blend
          export: MyAwesomeExportForLinux
```
