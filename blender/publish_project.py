import bpy
import sys, os

target = sys.argv.pop()
if target == 'krom': target = 'krom-linux' # TODO

wrd = bpy.data.worlds['Arm']
wrd.arm_exporterlist.add()
wrd.arm_exporterlist_index = len(wrd.arm_exporterlist)-1
wrd.arm_exporterlist[wrd.arm_exporterlist_index].name = 'Preset'
wrd.arm_exporterlist[wrd.arm_exporterlist_index].arm_project_target = target
wrd.arm_exporterlist[wrd.arm_exporterlist_index].arm_project_scene = bpy.context.scene

bpy.ops.arm.publish_project()
