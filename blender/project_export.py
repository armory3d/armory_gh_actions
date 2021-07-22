import bpy, sys, os

wrd = bpy.data.worlds['Arm']

if len(wrd.arm_exporterlist) == 0:
        print("Project has no exporters")

exporter_index = None

exporter_name = sys.argv.pop()
print(exporter_name)
if exporter_name != None:
    i = 0
    for exporter in wrd.arm_exporterlist:
        if exporter.name == exporter_name:
            print("Exporter found, target: "+exporter.arm_project_target)
            exporter_index = i
            break
        i = i+1

if exporter_index == None:
    exporter_index = 0

print("Exporting "+str(exporter_index))
wrd.arm_exporterlist_index = exporter_index
bpy.ops.arm.publish_project()
