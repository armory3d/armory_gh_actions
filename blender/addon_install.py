import os, sys
import bpy, addon_utils
from pathlib import Path

sdk_path = sys.argv.pop()
if not os.path.isdir(sdk_path): sdk_path = os.getenv("ARMSDK")
if sdk_path is None:
    print("sdk path not specified")
    exit(1)
if not os.path.isfile(sdk_path+"/armory.py"):
    print("armsdk not found")
    exit(1)
sdk_path = str(Path(sdk_path).resolve())
bpy.ops.preferences.addon_install(filepath=sdk_path+'/armory.py')
bpy.ops.preferences.addon_enable(module='armory')
bpy.context.preferences.addons["armory"].preferences['sdk_path'] = sdk_path
bpy.ops.wm.save_userpref()
# bpy.ops.preferences.addon_refresh()
bpy.ops.wm.quit_blender()
