Armory3D Github Actions
=======================
This action sets up a [armory3d](https://armory3d.org/) environment to build projects in your github workflows.

# Usage

See [action.yml](action.yml)

## Inputs

| Name | Description | Required | Default |
| - | - | - | - |
| `blend` | Main blend file | Yes | |
| `build` | Build exporter name | No | The active [armory exporter](.github/exporter-presets.png) |
| `publish` | Publish exporter name | No | The active [armory exporter](.github/exporter-presets.png) |
| `blender` | Blender version ([snap](https://snapcraft.io/blender)) | No | `2.93lts/stable` |
| `armsdk_url` | URL of to the armsdk repository | No | `https://github.com/armory3d/armsdk`
| `armsdk_ref` | Named branch, tag, or SHA of the armsdk repository | No | `master`

Either `build` or `publish` must be given the name of an *exporter* preset defined in [`Render Properties - Armory Exporter`](exporter-presets.png). It can have any name, but is most likely named after the build target.

## Outputs

| Name | Description | Default |
| - | - | - |
| `code` | Exit code | |
| `time` | Duration ms | |
| `result` | stdout data |  |
| `error` | stderr  data |  |

---

See: [.github/workflows/empty-project.yml](.github/workflows/empty-project.yml)

### Publish project
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Publish
        uses: armory3d/armory_gh_actions@v0.1.12
        with:
          blend: awesome.blend # Main blend file
          publish: html5 # Name of the armory exporter
```

### Custom blender, armsdk version
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Publish
        uses: armory3d/armory_gh_actions@v0.1.12
          with:
            blend: awesome.blend # Main blend file
            publish: linux # Name of the armory exporter
            blender: latest/candidate  # Blender snap package version
            armsdk_ref: 21.12 # Armsdk version
```

### Cache armsdk to speedup builds, print build results
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      armsdk_version: 21.12
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
        uses: armory3d/armory_gh_actions@v0.1.12
        with:
          blend: awesome.blend
          publish: html5
          armsdk_ref: ${{ env.armsdk_version }}
      - name: Result
        run: |
          echo "Code: ${{ steps.awesome.outputs.code }}"
          echo "Time: ${{ steps.awesome.outputs.time }}"
```

---

[![test](https://github.com/armory3d/armory_gh_actions/actions/workflows/test.yml/badge.svg)](https://github.com/armory3d/armory_gh_actions/actions/workflows/test.yml)
