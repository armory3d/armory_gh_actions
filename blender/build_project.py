import os, sys
import bpy
import arm.make_state as state

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
    elif argc == 1:
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

bpy.ops.arm.build_project()
code = state.proc_build.poll()
sys.exit(code)
# bpy.ops.wm.quit_blender()
