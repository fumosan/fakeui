// 更新日期时间的函数
function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('zh-Hant', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeString = now.toLocaleTimeString('zh-Hant');
    document.getElementById('current-datetime').textContent = dateString + ' ' + timeString;
}

// 每秒更新时间
setInterval(updateDateTime, 1000);

let ws; // WebSocket 实例

// 初始化WebSocket连接的函数
function connectWebSocket() {
    const wsUrl = document.getElementById('ws-url').value;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        document.getElementById('ws-messages-log').innerHTML += 'WebSocket 已连接<br/>';
    };

    ws.onmessage = (event) => {
        document.getElementById('ws-messages-log').innerHTML += `收到消息: ${event.data}<br/>`;
    };

    ws.onclose = () => {
        document.getElementById('ws-messages-log').innerHTML += 'WebSocket 已断开<br/>';
    };

    ws.onerror = (error) => {
        document.getElementById('ws-messages-log').innerHTML += `WebSocket 错误: ${error}<br/>`;
    };
}

// 切换電燈状态的函数
function toggleLight(status) {
    const message = status ? 'onoff on 111 1' : 'onoff off 111 1';
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        document.getElementById('ws-messages-log').innerHTML += `发送灯光状态: ${message}<br/>`;
    } else {
        document.getElementById('ws-messages-log').innerHTML += 'WebSocket 未连接。<br/>';
    }
}



// DOMContentLoaded 事件确保所有元素都加载完成
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('ws-connect-btn').addEventListener('click', connectWebSocket);
    document.getElementById('ws-disconnect-btn').addEventListener('click', function() {
        if (ws) {
            ws.close();
        }
    });
    document.getElementById('ws-send-btn').addEventListener('click', function() {
        const message = document.getElementById('ws-message').value;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            document.getElementById('ws-messages-log').innerHTML += `发送消息: ${message}<br/>`;
        } else {
            document.getElementById('ws-messages-log').innerHTML += 'WebSocket 未连接。<br/>';
        }
    });
    document.getElementById('ws-clear-log-btn').addEventListener('click', function() {
        document.getElementById('ws-messages-log').innerHTML = '';
    });
    document.getElementById('light-switch').addEventListener('change', function() {
        toggleLight(this.checked);
    });
});

//

// 血壓計 
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pair-bp-button').addEventListener('click', function() {
	// 显示模态窗口
    	document.getElementById('deviceModal').style.display = "block";
});

	// 获取 <span> 元素，它可以关闭模态窗口
	var close = document.getElementsByClassName("close")[0];

	// 当用户点击 (x)，关闭模态窗口
	close.onclick = function() {
	    document.getElementById('deviceModal').style.display = "none";	
	}

	// 当用户点击模态窗口外的任何地方，关闭
	window.onclick = function(event) {
    if (event.target == document.getElementById('deviceModal')) {
	        document.getElementById('deviceModal').style.display = "none";
    	}
}



        // 发送请求到后端以连接血压计
        fetch('/connect', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address: '设备地址' }) // 实际应用中应由用户选择
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'connected') {
                document.getElementById('bp-status').textContent = 'paired';
                // 开始周期性地从后端获取最新数据
                startPolling();
            } else {
                document.getElementById('bp-status').textContent = 'pairing failed';
            }
        })
        .catch(error => {
            console.log(error);
            document.getElementById('bp-status').textContent = '连接失败';
        });
    });
});

function startPolling() {
    setInterval(() => {
        fetch('/bp-data') // 假设'/bp-data'是后端提供实时血压数据的路由
            .then(response => response.json())
            .then(data => {
                // 更新前端显示的血压和心率数据
                document.querySelector('.high-pressure').textContent = data.systolic;
                document.querySelector('.low-pressure').textContent = data.diastolic;
                document.querySelector('.heart-rate').textContent = data.heartRate;
            });
    }, 3000); // 每3秒请求一次新数据
}






    // 其他事件监听器...
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pair-bp-button').addEventListener('click', function() {
        // BLE 配对和连接代码
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // 电灯开关状态改变时
    document.getElementById('light-switch').addEventListener('change', function() {
        if(this.checked) {
            document.querySelector('#device1 .status').textContent = 'On'; // 如果开关打开，状态显示为 'On'
        } else {
            document.querySelector('#device1 .status').textContent = 'Off'; // 如果开关关闭，状态显示为 'Off'
        }
    });

    // PH 电灯开关状态改变时
    document.getElementById('ph-lamp-switch').addEventListener('change', function() {
        if(this.checked) {
            document.querySelector('#ph-lamp .ph-status').textContent = 'On'; // 如果开关打开，状态显示为 'On'
        } else {
            document.querySelector('#ph-lamp .ph-status').textContent = 'Off'; // 如果开关关闭，状态显示为 'Off'
        }
    });
});


// DOMContentLoaded 事件确保所有元素都加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 监听电灯开关的状态变化
    document.getElementById('light-switch').addEventListener('change', function() {
        const statusText = this.checked ? 'On' : 'Off'; // 根据开关是否选中设置状态文本
        document.querySelector('#device1 .status').textContent = statusText; // 更新电灯状态显示
    });

    // 监听 PH 电灯开关的状态变化
    document.getElementById('ph-lamp-switch').addEventListener('change', function() {
        const statusText = this.checked ? 'On' : 'Off'; // 根据开关是否选中设置状态文本
        document.querySelector('#ph-lamp .ph-status').textContent = statusText; // 更新 PH 电灯状态显示
    });
});

//這邊開始小視窗
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('input');




// 切换灯光状态的函数
function toggleLight(status) {
    // 这里假设你有某种方式（例如通过WebSocket）来控制灯光
    const message = status ? '开电燈' : '关电燈'; // 根据状态设置相应的命令
    console.log(`切换灯光状态: ${message}`); // 日志输出
    // 这里添加控制灯光的代码，例如发送WebSocket消息
}

// 用于向后端发送消息并更新聊天室的函数
function sendMessage() {
    const message = input.value;
    input.value = ''; // 清空输入框

    // 检查是否是控制灯光的命令
    if (message === '开电燈') {
        toggleLight(true); // 打开灯光
    } else if (message === '关电燈') {
        toggleLight(false); // 关闭灯光
    }

    // 使用fetch发送消息到后端
    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        updateMessages(); // 发送消息后更新聊天室
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// 用于从后端获取最新消息并更新聊天室的函数
function updateMessages() {
    fetch('/messages')
        .then(response => response.json())
        .then(messages => {
            messagesDiv.innerHTML = ''; // 清空现有消息
// 显示最新的五条消息
            messages.slice(-6),forEach(msg => {
                const p = document.createElement('p');
                p.textContent = `${msg.time} ${msg.name}: ${msg.content}`;
                messagesDiv.appendChild(p);
            });
        });
}

// 定期更新聊天室
setInterval(updateMessages, 5000);
