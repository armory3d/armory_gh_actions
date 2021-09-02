Armory3D Github Actions
=======================

[![test](https://github.com/tong/armory_gh_actions/actions/workflows/test.yml/badge.svg)](https://github.com/tong/armory_gh_actions/actions/workflows/test.yml)

This action sets up a [blender](https://www.blender.org/)/[armory](https://github.com/armory3d/armory) environment to build projects in your github workflows.

---

# Examples

Build project with active exporter:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: tong/armory_gh_action@v0.1.4
        with:
            blend: project.blend # Main blend file            
```

Build project with using specified armory exporter, blender and armsdk version:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: tong/armory_gh_action@v0.1.4
        with:
          blend: awesome.blend # Main blend file
          publish: AwesomeGame_linux # Name of the srmory exporter preset
          blender: latest/candidate  # Blender snap package version
          armsdk: 21.08 # Armsdk version
```

Cache armsdk to speedup builds:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      armsdk_version: 21.08
    steps:
      - uses: actions/checkout@v2
      - name: Cache armsdk
        uses: actions/cache@v2
        env:
          armsdk-cache-version: ${{ env.armsdk_version }}
        with:
          path: _armsdk_
          key: armsdk-cache-${{ env.armsdk-cache-version }}
      - name: Build
        id: awesome
        uses: ./
        with:
          blend: awesome.blend
          publish: html5
          armsdk: ${{ env.armsdk_version }}
```

---

# Inputs

| Name | Description | Required | Default |
| - | - | - | - |
| `blend` | Main blend file | Yes | N/A |
| `build` | Build exporter name | No | The active armory exporter |
| `publish` | Publish exporter name | No | The active armory exporter |
| `blender` | Blender version ([snap](https://snapcraft.io/blender)) | No | latest/stable |
| `armsdk` | armsdk version/ref | No | `master`
| `armsdk_repository` | Path to the armsdk repository | No | `https://github.com/armory3d/armsdk`


# Outputs

| Name | Description | Default |
| - | - | - |
| `code` | Exit code | 0 |
| `stdout` | Process stdout |  |
| `stderr` | Process stderr |  |
| `time` | Build time ms | |

---
