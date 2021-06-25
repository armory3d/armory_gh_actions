import os
import bpy
from addon_utils import check,enable

if not check("armory")[1]:
    bpy.ops.preferences.addon_install(filepath='armsdk/armory.py')
    bpy.ops.preferences.addon_enable(module='armory')
    bpy.context.preferences.addons["armory"].preferences['sdk_path'] = os.getcwd()+'/armsdk/'
    bpy.ops.wm.save_userpref()
