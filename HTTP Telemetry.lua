gn, gb, sn, sb, pn, pb, pt = input.getNumber, input.getBool, output.setNumber, output.setBool, property.getNumber, property.getBool, property.getText
pi, pi2, sin, cos, sqrt, atan, abs = math.pi, math.pi * 2, math.sin, math.cos, math.sqrt, math.atan, math.abs

frequency = math.max(0, math.floor(60 / (pn('Data collect frequency') or 1) + 0.5) - 1)
port = 8080
labelName = 'Channel'

pendingRequestsMax = 4
pendingRequests = 0
new = false

tickCounter = 0
data = {}
frameId = 1

function readLabels()
    local frame = {}
    table.insert(frame, frameId)
    frameId = frameId + 1
    for i = 1, 32, 1 do
        local label = pt(labelName .. ' ' .. i) or ''
        if label ~= '' then
            label = label:gsub(' ', '_')
            label = '"' .. label .. '"'
            table.insert(frame, label)
        end
    end
    return frame
end

function readFrame()
    local frame = {}
    table.insert(frame, frameId)
    frameId = frameId + 1
    for i = 1, 32, 1 do
        if (pt(labelName .. ' ' .. i) or '') ~= '' then
            table.insert(frame, gn(i))
        end
    end
    return frame
end

function sendData()
    if #data < 1 then
        return
    end
    if pendingRequests < pendingRequestsMax then
        pendingRequests = pendingRequests + 1
        local req = '/write?frames=['
        while #req < 1500 and #data > 0 do
            local frame = data[1]
            local json = '{"frameID":' .. frame[1] .. ','
            for i = 2, #frame do
                json = json .. '"p' .. (i - 1) .. '":' .. frame[i] .. ','
            end
            json = string.sub(json, 1, #json - 1)
            json = json .. '},'
            req = req .. json
            table.remove(data, 1)
        end
        req = string.sub(req, 1, #req - 1)
        req = req .. ']'
        async.httpGet(port, req)
    end
end

function newFile()
    if pendingRequests < pendingRequestsMax then
        pendingRequests = pendingRequests + 1
        local req = '/new'
        async.httpGet(port, req)
        return true
    end
    return false
end

function onTick()
    if gb(1) then
        if #data + pendingRequests == 0 then
            if not new then
                if newFile() then
                    new = true
                    table.insert(data, readLabels())
                end
            end
        end
        if tickCounter >= frequency then
            tickCounter = 0
            table.insert(data, readFrame())
        else
            tickCounter = tickCounter + 1
        end
    else
        labelSend = false
        new = false
        frameId = 1
    end
    sendData()

    sn(1, #data + pendingRequests)
end

function httpReply(port, request_body, response_body)
    pendingRequests = math.max(pendingRequests - 1, 0)
end
