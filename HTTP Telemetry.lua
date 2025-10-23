gn, gb, sn, sb, pn, pb, pt = input.getNumber, input.getBool, output.setNumber, output.setBool, property.getNumber, property.getBool, property.getText
pi, pi2, sin, cos, sqrt, atan, abs = math.pi, math.pi * 2, math.sin, math.cos, math.sqrt, math.atan, math.abs

frequency = 60 / (pn('Data collect frequency') or 1) - 1
port = 8080
labelName = 'Channel'

httpReady = true
new = false

tickCounter = 0
data = {}

function readLabels()
    local frame = {}
    for i = 1, 32, 1 do
        local label = pt(labelName .. ' ' .. i) or ''
        if label ~= '' then
            label = label:gsub(' ', '_')
            table.insert(frame, label)
        end
    end
    return frame
end

function readFrame()
    local frame = {}
    for i = 1, 32, 1 do
        if (pt(labelName .. ' ' .. i) or '') ~= '' then
            table.insert(frame, gn(i))
        end
    end
    return frame
end

function sendFrame(frame)
    if #frame > 0 and httpReady then
        httpReady = false
        local req = '/write?'
        for i, v in ipairs(frame) do
            req = req .. 'p' .. i .. '=' .. v .. '&'
        end
        req = string.sub(req, 1, #req - 1)
        async.httpGet(port, req)
        return true
    end
    return false
end

function newFile()
    if httpReady then
        httpReady = false
        local req = '/new'
        async.httpGet(port, req)
        return true
    end
    return false
end

function onTick()
    if gb(1) then
        if #data == 0 then
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
        httpReady = true
        labelSend = false
        new = false
    end
    if #data > 0 then
        if (sendFrame(data[1])) then
            table.remove(data, 1)
        end
    end

    sn(1, #data)
end

function httpReply(port, request_body, response_body)
    httpReady = true
end
