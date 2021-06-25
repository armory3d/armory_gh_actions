import sys, os, platform
import bpy

def get_os():
    s = platform.system()
    if s == 'Windows':
        return 'win'
    elif s == 'Darwin':
        return 'mac'
    else:
        return 'linux'

target = sys.argv.pop()
mode = sys.argv.pop()
if target == 'krom': target = 'krom-'+get_os() 

wrd = bpy.data.worlds['Arm']
wrd.arm_exporterlist.add()
wrd.arm_exporterlist_index = len(wrd.arm_exporterlist)-1
wrd.arm_exporterlist[wrd.arm_exporterlist_index].name = 'Temp'
wrd.arm_exporterlist[wrd.arm_exporterlist_index].arm_project_target = target
wrd.arm_exporterlist[wrd.arm_exporterlist_index].arm_project_scene = bpy.context.scene

print(mode)
print(target)

if mode == "release":
    bpy.ops.arm.publish_project()
else:
    bpy.ops.arm.build_project()
