import os, sys
import bpy, addon_utils
from pathlib import Path

def abort(message,code=1):
    print(message)
    exit(code)

sdk_path = sys.argv.pop()
if not os.path.isdir(sdk_path):
    sdk_path = os.getenv("ARMORY_SDK")
if sdk_path is None:
    abort("sdk path not specified")
if not os.path.isfile(sdk_path+"/armory.py"):
    abort("sdk not found")

sdk_path = str(Path(sdk_path).resolve())

bpy.ops.preferences.addon_install(filepath=sdk_path+'/armory.py')
bpy.ops.preferences.addon_enable(module='armory')
bpy.context.preferences.addons["armory"].preferences['sdk_path'] = sdk_path
bpy.ops.wm.save_userpref()
#bpy.ops.preferences.addon_refresh()
# bpy.ops.wm.quit_blender()
   