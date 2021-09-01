import os, sys
import bpy
# import arm, arm.utils

## Publishes the project with given exporter name

wrd = bpy.data.worlds['Arm']

if(len(wrd.arm_exporterlist)) == 0:
    print('Project has no exporters')
    exit(1)

if '--' in sys.argv:
    argv = sys.argv[sys.argv.index('--')+1:]
    argc = len(argv)
    if argc == 0:
        print("Missing exporter argument")
        exit(1)
    exporter_index = None
    exporter_name = argv[0]
    i = 0
    for exporter in wrd.arm_exporterlist:
        if exporter.name == exporter_name:
            exporter_index = i
            break
        else: i += 1
    if exporter_index == None:
        print('No exporters named ['+exporter_name+'] found')
        exit(1)
    wrd.arm_exporterlist_index = exporter_index

bpy.ops.arm.publish_project()
bpy.ops.wm.quit_blender()

# if False:
#     # exporter = sys.argv[0]
#     # print(exporter)
#     target = 'html5'
#     #target = sys.argv.pop()
#     #mode = sys.argv.pop()

#     wrd = bpy.data.worlds['Arm']
#     # if(len(wrd.arm_exporterlist)==0):

#     print("SET VERBOSE MODE_:::")
#     wrd.arm_verbose_output=True

#     wrd.arm_exporterlist.add()
#     wrd.arm_exporterlist[wrd.arm_exporterlist_index].name = 'Temp'
#     wrd.arm_exporterlist[wrd.arm_exporterlist_index].arm_project_target = target
#     wrd.arm_exporterlist[wrd.arm_exporterlist_index].arm_project_scene = bpy.context.scene
#     wrd.arm_exporterlist_index = len(wrd.arm_exporterlist) - 1

#     # bpy.ops.arm.clean_project()
#     # bpy.ops.arm.build_project()
#     bpy.ops.arm.publish_project()
#     # bpy.ops.wm.quit_blender()

#     # bpy.ops.arm.build_project()
