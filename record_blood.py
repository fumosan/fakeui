import time
from bluepy import btle

class BloodPressureDelegate(btle.DefaultDelegate):
    def __init__(self, filepath):
        btle.DefaultDelegate.__init__(self)
        self.filepath = filepath

    def handleNotification(self, cHandle, data):
        # 处理从血压计收到的数据
        print("Received data from BLE device")
        systolic = int.from_bytes(data[1:3], byteorder='little')
        diastolic = int.from_bytes(data[3:5], byteorder='little')
        pulse_rate = int.from_bytes(data[7:9], byteorder='little')
        print(f"Systolic: {systolic}, Diastolic: {diastolic}, Pulse: {pulse_rate}")
        
        # 将数据记录到文件
        with open(self.filepath, 'a') as f:
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
            f.write(f"{timestamp}, {systolic}, {diastolic}, {pulse_rate}\n")

def main():
    filepath = "/home/pi/workspace/fakeui/blood_pressure_log.csv"
    device_address = "xx:xx:xx:xx:xx:xx"  # 替换为您的血压计的蓝牙地址

    print("Connecting to device")
    p = btle.Peripheral(device_address)
    p.setDelegate(BloodPressureDelegate(filepath))
    
    # 这里的UUIDs需要替换为您的血压计的服务和特性的UUID
    svc = p.getServiceByUUID("血压服务的UUID")
    ch = svc.getCharacteristics("血压特性的UUID")[0]

    while True:
        if p.waitForNotifications(1.0):
            # 处理通知
            continue
        print("Waiting for notifications...")

if __name__ == "__main__":
    main()
