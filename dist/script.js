var SPIFFS_currentpath = "/",
        SPIFFS_currentfile = "",
        SPIFFS_upload_ongoing = !1;

let jogStep; //Pull for jog commands distance

    function SPIFFSdlg(e) { null != setactiveModal("SPIFFSdlg.html") && (void 0 !== e && (SPIFFS_currentpath = e), id("SPIFFS-select").value = "", id("SPIFFS_file_name").innerHTML = translate_text_item("No file chosen"), displayNone("SPIFFS_uploadbtn"), displayNone("SPIFFS_prg"), displayNone("uploadSPIFFSmsg"), displayNone("SPIFFS_select_files"), showModal(), refreshSPIFFS()) }

    function closeSPIFFSDialog(e) { SPIFFS_upload_ongoing ? alertdlg(translate_text_item("Busy..."), translate_text_item("Upload is ongoing, please wait and retry.")) : closeModal(e) }

    function SPIFFSnavbar() {
        var e = "<table><tr>",
            t = SPIFFS_currentpath.split("/"),
            n = "/",
            a = 1;
        for (e += "<td class='tooltip'><span class='tooltip-text'>Go to root directory</span><button class='btn btn-primary'  onclick=\"SPIFFS_currentpath='/'; SPIFFSSendCommand('list','all');\">/</button></td>"; a < t.length - 1;) e += "<td><button class='btn btn-link' onclick=\"SPIFFS_currentpath='" + (n += t[a] + "/") + "'; SPIFFSSendCommand('list','all');\">" + t[a] + "</button></td><td>/</td>", a++;
        return e += "</tr></table>"
    }

    function SPIFFSselect_dir(e) { SPIFFS_currentpath += e + "/", SPIFFSSendCommand("list", "all") }

    function SPIFFS_Createdir() { inputdlg(translate_text_item("Please enter directory name"), translate_text_item("Name:"), processSPIFFS_Createdir) }

    function processSPIFFS_Createdir(e) { 0 < e.length && SPIFFSSendCommand("createdir", e.trim()) }

    function SPIFFSDelete(e) { SPIFFS_currentfile = e, confirmdlg(translate_text_item("Please Confirm"), translate_text_item("Confirm deletion of file: ") + e, processSPIFFSDelete) }

    function processSPIFFSDelete(e) { "yes" == e && SPIFFSSendCommand("delete", SPIFFS_currentfile), SPIFFS_currentfile = "" }

    function SPIFFSDeletedir(e) { SPIFFS_currentfile = e, confirmdlg(translate_text_item("Please Confirm"), translate_text_item("Confirm deletion of directory: ") + e, processSPIFFSDeleteDir) }

    function processSPIFFSDeleteDir(e) { "yes" == e && SPIFFSSendCommand("deletedir", SPIFFS_currentfile), SPIFFS_currentfile = "" }

    function SPIFFSSendCommand(e, t) {
        e = "/files?action=" + e;
        e += "&filename=" + encodeURI(t), e += "&path=" + encodeURI(SPIFFS_currentpath), id("SPIFFS_loader").style.visibility = "visible", console.log(e), SendGetHttp(e, SPIFFSsuccess, SPIFFSfailed)
    }

    function SPIFFSsuccess(e) {
        e = JSON.parse(e);
        id("SPIFFS_loader").style.visibility = "hidden", displayBlock("refreshSPIFFSbtn"), displayBlock("SPIFFS_select_files"), SPIFFSdispatchfilestatus(e)
    }

    function SPIFFSfailed(e, t) { id("SPIFFS_loader").style.visibility = "hidden", displayBlock("refreshSPIFFSbtn"), displayBlock("refreshSPIFFSbtn"), alertdlg(translate_text_item("Error"), "Error " + e + " : " + t), console.log("Error " + e + " : " + t) }

    function SPIFFSdispatchfilestatus(e) {
        var t, n = "",
            n = translate_text_item("Total:") + " " + e.total;
        n += "&nbsp;&nbsp;|&nbsp;&nbsp;" + translate_text_item("Used:") + " " + e.used, n += "&nbsp;", n += "<meter min='0' max='100' high='90' value='" + e.occupation + "'></meter>&nbsp;" + e.occupation + "%", "Ok" != e.status && (n += "<br>" + translate_text_item(e.status)), id("SPIFFS_status").innerHTML = n, n = "", "/" != SPIFFS_currentpath && (t = SPIFFS_currentpath.lastIndexOf("/", SPIFFS_currentpath.length - 2), n += "<tr style='cursor:pointer;' onclick=\"SPIFFS_currentpath='" + SPIFFS_currentpath.slice(0, t + 1) + "'; SPIFFSSendCommand('list','all');\"><td >" + get_icon_svg("level-up") + "</td><td colspan='4'> Up..</td></tr>"), e.files.sort(function(e, t) { return compareStrings(e.name, t.name) });
        for (var a = 0; a < e.files.length; a++) "-1" != String(e.files[a].size) && (n += "<tr>", n += "<td  style='vertical-align:middle; color:#5BC0DE'>" + get_icon_svg("file") + "</td>", n += "<td  width='100%'  style='vertical-align:middle'><a href=\"" + e.path + e.files[a].name + '" target=_blank download><button  class="btn btn-link no_overflow">', n += e.files[a].name, n += "</button></a></td><td nowrap  style='vertical-align:middle'>", n += e.files[a].size, n += "</td><td width='0%'  style='vertical-align:middle'><button class=\"btn btn-danger btn-xs\" style='padding: 5px 5px 0px 5px;' onclick=\"SPIFFSDelete('" + e.files[a].name + "')\">", n += get_icon_svg("trash"), n += "</button></td></tr>");
        for (a = 0; a < e.files.length; a++) "-1" == String(e.files[a].size) && (n += "<tr>", n += "<td style='vertical-align:middle ; color:#5BC0DE'>" + get_icon_svg("folder-close") + "</td>", n += "<td width='100%'  style='vertical-align:middle'><button class=\"btn btn-link\" onclick=\"SPIFFSselect_dir('" + e.files[a].name + "');\">", n += e.files[a].name, n += "</button></td><td>", n += "</td><td width='0%' style='vertical-align:middle'><button class=\"btn btn-danger btn-xs\" style='padding: 5px 4px 0px 4px;' onclick=\"SPIFFSDeletedir('" + e.files[a].name + "')\">", n += get_icon_svg("trash"), n += "</button></td></tr>");
        id("SPIFFS_file_list").innerHTML = n, id("SPIFFS_path").innerHTML = SPIFFSnavbar()
    }

    function refreshSPIFFS() { id("SPIFFS-select").value = "", id("uploadSPIFFSmsg").innerHTML = "", id("SPIFFS_file_name").innerHTML = translate_text_item("No file chosen"), displayNone("SPIFFS_uploadbtn"), displayNone("refreshSPIFFSbtn"), displayNone("SPIFFS_select_files"), SPIFFSSendCommand("list", "all") }

    function checkSPIFFSfiles() {
        var e, t = id("SPIFFS-select").files;
        displayNone("uploadSPIFFSmsg"), 0 < t.length ? (1 == t.length ? id("SPIFFS_file_name").innerHTML = t[0].name : (e = translate_text_item("$n files"), id("SPIFFS_file_name").innerHTML = e.replace("$n", t.length)), id("SPIFFS_uploadbtn").click()) : id("SPIFFS_file_name").innerHTML = translate_text_item("No file chosen")
    }

    function SPIFFSUploadProgressDisplay(e) { e.lengthComputable && (e = e.loaded / e.total * 100, id("SPIFFS_prg").value = e, id("uploadSPIFFSmsg").innerHTML = translate_text_item("Uploading ") + SPIFFS_currentfile + " " + e.toFixed(0) + "%") }

    function SPIFFS_UploadFile() {
        if (http_communication_locked) alertdlg(translate_text_item("Busy..."), translate_text_item("Communications are currently locked, please wait and retry."));
        else {
            var e = id("SPIFFS-select").files,
                t = new FormData;
            t.append("path", SPIFFS_currentpath);
            for (var n = 0; n < e.length; n++) {
                var a = e[n],
                    i = SPIFFS_currentpath + a.name + "S";
                t.append(i, a.size), t.append("myfile[]", a, SPIFFS_currentpath + a.name)
            }
            displayNone("SPIFFS-select_form"), displayNone("SPIFFS_uploadbtn"), SPIFFS_upload_ongoing = !0, displayBlock("uploadSPIFFSmsg"), displayBlock("SPIFFS_prg"), SPIFFS_currentfile = 1 == e.length ? e[0].name : "", id("uploadSPIFFSmsg").innerHTML = translate_text_item("Uploading ") + SPIFFS_currentfile, SendFileHttp("/files", t, SPIFFSUploadProgressDisplay, SPIFFSUploadsuccess, SPIFFSUploadfailed)
        }
    }

    function SPIFFSUploadsuccess(e) { id("SPIFFS-select").value = "", id("SPIFFS_file_name").innerHTML = translate_text_item("No file chosen"), displayBlock("SPIFFS-select_form"), displayNone("SPIFFS_prg"), displayNone("SPIFFS_uploadbtn"), id("uploadSPIFFSmsg").innerHTML = "", displayBlock("refreshSPIFFSbtn"), SPIFFS_upload_ongoing = !1, e = e.replace('"status":"Ok"', '"status":"Upload done"'), SPIFFSdispatchfilestatus(JSON.parse(e)) }

    function SPIFFSUploadfailed(e, t) { displayBlock("SPIFFS-select_form"), displayNone("SPIFFS_prg"), displayBlock("SPIFFS_uploadbtn"), id("uploadSPIFFSmsg").innerHTML = "", displayNone("uploadSPIFFSmsg"), displayBlock("refreshSPIFFSbtn"), console.log("Error " + e + " : " + t), 0 != esp_error_code ? (alertdlg(translate_text_item("Error") + " (" + esp_error_code + ")", esp_error_message), id("SPIFFS_status").innerHTML = translate_text_item("Error : ") + esp_error_message, esp_error_code = 0) : (alertdlg(translate_text_item("Error"), "Error " + e + " : " + t), id("SPIFFS_status").innerHTML = translate_text_item("Upload failed : ") + e), SPIFFS_upload_ongoing = !1, refreshSPIFFS() }

    function UIdisableddlg(e) { null != setactiveModal("UIdisableddlg.html") && (e && (id("disconnection_msg").innerHTML = translate_text_item("Connection lost for more than 20s")), showModal()) }

    function alertdlg(e, t, n) {
        var a = setactiveModal("alertdlg.html", n);
        null != a && (n = a.element.getElementsByClassName("modal-title")[0], a = a.element.getElementsByClassName("modal-text")[0], n.innerHTML = e, a.innerHTML = t, showModal())
    }

    function infodlg(e, t, n) {
        var a = setactiveModal("infodlg.html", n);
        null != a && (n = a.element.getElementsByClassName("modal-title")[0], a = a.element.getElementsByClassName("modal-text")[0], n.innerHTML = e, a.innerHTML = t, showModal())
    }
    var ESP3D_authentication = !1,
        page_id = "",
        convertDHT2Fahrenheit = !1,
        ws_source, event_source, log_off = !1,
        async_webcommunication = !1,
        websocket_port = 0,
        websocket_ip = "",
        esp_hostname = "ESP3D WebUI",
        EP_HOSTNAME, EP_STA_SSID, EP_STA_PASSWORD, EP_STA_IP_MODE, EP_STA_IP_VALUE, EP_STA_GW_VALUE, EP_STA_MK_VALUE, EP_WIFI_MODE, EP_AP_SSID, EP_AP_PASSWORD, EP_AP_IP_VALUE, EP_BAUD_RATE = 112,
        EP_AUTH_TYPE = 119,
        EP_TARGET_FW = 461,
        EP_IS_DIRECT_SD = 850,
        EP_PRIMARY_SD = 851,
        EP_SECONDARY_SD = 852,
        EP_DIRECT_SD_CHECK = 853,
        SETTINGS_AP_MODE = 1,
        SETTINGS_STA_MODE = 2,
        SETTINGS_FALLBACK_MODE = 3,
        interval_ping = -1,
        last_ping = 0,
        enable_ping = !0,
        esp_error_message = "",
        esp_error_code = 0;

    function Init_events(e) { page_id = e.data, console.log("connection id = " + page_id) }

    function ActiveID_events(e) { page_id != e.data && (Disable_interface(), console.log("I am disabled"), event_source.close()) }

    function DHT_events(e) { Handle_DHT(e.data) }

    function browser_is(e) {
        var t = navigator.userAgent;
        switch (e) {
            case "IE":
                if (-1 != t.indexOf("Trident/")) return !0;
                break;
            case "Edge":
                if (-1 != t.indexOf("Edge")) return !0;
                break;
            case "Chrome":
                if (-1 != t.indexOf("Chrome")) return !0;
                break;
            case "Firefox":
                if (-1 != t.indexOf("Firefox")) return !0;
                break;
            case "MacOSX":
                if (-1 != t.indexOf("Mac OS X")) return !0;
                break;
            default:
                return !1
        }
        return !1
    }
    window.onload = function() { displayNone("loadingmsg"), console.log("Connect to board"), connectdlg(), console.log(navigator.userAgent), browser_is("IE") && (id("control-body").className = "panel-body", id("command-body").className = "panel-body", id("file-body").className = "panel-body panel-height panel-max-height panel-scroll"), tabletInit() };
    var wsmsg = "";

    function startSocket() {
        try { ws_source = async_webcommunication ? new WebSocket("ws://" + document.location.host + "/ws", ["arduino"]) : (console.log("Socket is " + websocket_ip + ":" + websocket_port), new WebSocket("ws://" + websocket_ip + ":" + websocket_port, ["arduino"])) } catch (e) { console.error(e) } ws_source.binaryType = "arraybuffer", ws_source.onopen = function(e) { console.log("Connected") }, ws_source.onclose = function(e) { console.log("Disconnected"), log_off || setTimeout(startSocket, 3e3) }, ws_source.onerror = function(e) { console.log("ws error", e) }, ws_source.onmessage = function(e) {
            var t = "";
            if (e.data instanceof ArrayBuffer) {
                for (var n, a = new Uint8Array(e.data), i = 0; i < a.length; i++) t += String.fromCharCode(a[i]), 10 == a[i] && (n = wsmsg += t.replace("\r\n", "\n"), t = wsmsg = "", Monitor_output_Update(n), process_socket_response(n), n.startsWith("<") || n.startsWith("ok T:") || n.startsWith("X:") || n.startsWith("FR:") || n.startsWith("echo:E0 Flow") || console.log(n));
                wsmsg += t
            } else {
                e = (t += e.data).split(":");
                2 <= e.length && ("CURRENT_ID" == e[0] && (page_id = e[1], console.log("connection id = " + page_id)), enable_ping && "PING" == e[0] && (page_id = e[1], last_ping = Date.now(), -1 == interval_ping && (interval_ping = setInterval(function() { check_ping() }, 1e4))), "ACTIVE_ID" == e[0] && page_id != e[1] && Disable_interface(), "DHT" == e[0] && Handle_DHT(e[1]), "ERROR" == e[0] && (esp_error_message = e[2], esp_error_code = e[1], console.log("ERROR: " + e[2] + " code:" + e[1]), CancelCurrentUpload()), "MSG" == e[0] && (e[2], e[1], console.log("MSG: " + e[2] + " code:" + e[1])))
            }
        }
    }

    function check_ping() {}

    function disable_items(e, t) { var n = e.getElementsByTagName("*"); for (i = 0; i < n.length; i++) n[i].disabled = t }

    function ontogglePing(e) {
        (enable_ping = void 0 !== e ? e : !enable_ping) ? (-1 != interval_ping && clearInterval(interval_ping), last_ping = Date.now(), interval_ping = setInterval(function() { check_ping() }, 1e4), console.log("enable ping")) : (-1 != interval_ping && clearInterval(interval_ping), console.log("disable ping"))
    }

    function ontoggleLock(e) { void 0 !== e && (id("lock_UI").checked = e), id("lock_UI").checked ? (id("lock_UI_btn_txt").innerHTML = translate_text_item("Unlock interface"), disable_items(id("maintab"), !0), disable_items(id("configtab"), !0), id("progress_btn").disabled = !1, id("clear_monitor_btn").disabled = !1, id("monitor_enable_verbose_mode").disabled = !1, id("monitor_enable_autoscroll").disabled = !1, id("settings_update_fw_btn").disabled = !0, id("settings_restart_btn").disabled = !0, disable_items(id("JogUI"), !1), displayNone("JogUI")) : (id("lock_UI_btn_txt").innerHTML = translate_text_item("Lock interface"), disable_items(id("maintab"), !1), disable_items(id("configtab"), !1), id("settings_update_fw_btn").disabled = !1, id("settings_restart_btn").disabled = !1, id("JogUI").style.pointerEvents = "auto") }

    function Handle_DHT(e) {
        var t, n = e.split(" ");
        2 == n.length ? (t = convertDHT2Fahrenheit ? 1.8 * parseFloat(n[0]) + 32 : parseFloat(n[0]), id("DHT_humidity").innerHTML = parseFloat(n[1]).toFixed(2).toString() + "%", t = t.toFixed(2).toString() + "&deg;", t += convertDHT2Fahrenheit ? "F" : "C", id("DHT_temperature").innerHTML = t) : console.log("DHT data invalid: " + e)
    }
    var total_boot_steps = 5,
        current_boot_steps = 0;

    function display_boot_progress(e) { current_boot_steps += void 0 !== e ? e : 1, id("load_prg").value = Math.round(100 * current_boot_steps / total_boot_steps) }

    function Disable_interface(e) {
        e = void 0 !== e && e;
        log_off = http_communication_locked = !0, -1 != interval_ping && clearInterval(interval_ping), clear_cmd_list(), id("camera_frame").src = "", on_autocheck_position(!1), reportNone(), async_webcommunication && (event_source.removeEventListener("ActiveID", ActiveID_events, !1), event_source.removeEventListener("InitID", Init_events, !1), event_source.removeEventListener("DHT", DHT_events, !1)), ws_source.close(), document.title += "(" + decode_entitie(translate_text_item("Disabled")) + ")", UIdisableddlg(e)
    }

    function update_UI_firmware_target() { var e; return initpreferences(), console.log("E set to initpreferences"), id("control_x_position_label").innerHTML = "X", id("control_y_position_label").innerHTML = "Y", id("control_z_position_label").innerHTML = "Z", console.log("Pre showAxiscontrols()"), 
    //showAxiscontrols(), 
    console.log("Axis controls shown"), e = "Bantam Tools Plotter", last_grbl_pos = "", displayNone("configtablink"), displayNone("auto_check_control"), displayNone("progress_btn"), displayNone("abort_btn"), displayNone("motor_off_control"), id("tab_title_configuration").innerHTML = "<span translate>GRBL configuration</span>", id("tab_printer_configuration").innerHTML = "<span translate>GRBL</span>", id("files_input_file").accept = " .g, .gco, .gcode, .txt, .ncc, .G, .GCO, .GCODE, .TXT, .NC", displayNone("zero_xyz_btn"), displayNone("zero_x_btn"), displayNone("zero_y_btn"), 2 < grblaxis ? id("control_z_position_label").innerHTML = "Zw" : (hideAxiscontrols(), displayNone("preferences_control_z_velocity_group")), 3 < grblaxis && (id("zero_xyz_btn_txt").innerHTML += "A", grblzerocmd += " A0", build_axis_selection(), displayBlock("preferences_control_a_velocity_group"), id("positions_labels2").style.display = "inline-grid", displayBlock("control_a_position_display")), 4 < grblaxis && (displayBlock("control_b_position_display"), id("zero_xyz_btn_txt").innerHTML += "B", grblzerocmd += " B0", displayBlock("preferences_control_b_velocity_group")), 5 < grblaxis ? (displayBlock("control_c_position_display"), id("zero_xyz_btn_txt").innerHTML += "C", displayBlock("preferences_control_c_velocity_group")) : displayNone("control_c_position_display"), displayBlock("settings_filters"), id("control_x_position_label").innerHTML = "Xw", id("control_y_position_label").innerHTML = "Yw", EP_HOSTNAME = "Hostname", EP_STA_SSID = "Sta/SSID", EP_STA_PASSWORD = "Sta/Password", EP_STA_IP_MODE = "Sta/IPMode", EP_STA_IP_VALUE = "Sta/IP", EP_STA_GW_VALUE = "Sta/Gateway", EP_STA_MK_VALUE = "Sta/Netmask", EP_WIFI_MODE = "WiFi/Mode", EP_AP_SSID = "AP/SSID", EP_AP_PASSWORD = "AP/Password", EP_AP_IP_VALUE = "AP/IP", SETTINGS_AP_MODE = 2, SETTINGS_STA_MODE = 1, void 0 !== id("fwName") && (id("fwName").innerHTML = e), direct_sd && void 0 !== id("showSDused") ? id("showSDused").innerHTML = "<svg width='1.3em' height='1.2em' viewBox='0 0 1300 1200'><g transform='translate(50,1200) scale(1, -1)'><path  fill='#777777' d='M200 1100h700q124 0 212 -88t88 -212v-500q0 -124 -88 -212t-212 -88h-700q-124 0 -212 88t-88 212v500q0 124 88 212t212 88zM100 900v-700h900v700h-900zM500 700h-200v-100h200v-300h-300v100h200v100h-200v300h300v-100zM900 700v-300l-100 -100h-200v500h200z M700 700v-300h100v300h-100z' /></g></svg>" : id("showSDused").innerHTML = "", e }

    function Set_page_title(e) { void 0 !== e && (esp_hostname = e), document.title = esp_hostname }

    function initUI() { console.log("Init UI"), ESP3D_authentication && connectdlg(!1), console.log("Init UI post connectdlg(!1)"), AddCmd(display_boot_progress), "undefined" != typeof target_firmware && "undefined" != typeof web_ui_version && "undefined" != typeof direct_sd || alert("Missing init data!"), console.log("Pre update_UI_fw_targ"), update_UI_firmware_target(), console.log("Pre update_UI_fw_targ"), Set_page_title("BT Plotter"), void 0 !== id("UI_VERSION") && (id("UI_VERSION").innerHTML = web_ui_version), void 0 !== id("FW_VERSION") && (id("FW_VERSION").innerHTML = fw_version), id("maintablink").click(), void 0 !== id("grblcontroltablink") && id("grblcontroltablink").click(), console.log("Pre initUI_2"),initUI_2() }

    function initUI_2() { AddCmd(display_boot_progress), console.log("Get settings"), refreshSettings(!0), initUI_3() }

    function initUI_3() { AddCmd(display_boot_progress), console.log("Get macros"), init_controls_panel(), init_grbl_panel(), console.log("Get preferences"), getpreferenceslist(), initUI_4() }

    function initUI_4() { AddCmd(display_boot_progress), init_command_panel(), init_files_panel(!1), init_rss_panel(!1), "???" == target_firmware ? (console.log("Launch Setup"), AddCmd(display_boot_progress), closeModal("Connection successful"), setupdlg()) : (do_not_build_settings = !(setup_is_done = !0), AddCmd(display_boot_progress), build_HTML_setting_list(current_setting_filter), AddCmd(closeModal), AddCmd(show_main_UI)) }

    function show_main_UI() { displayUndoNone("main_ui") }

    function compareStrings(e, t) { return (e = e.toLowerCase()) < (t = t.toLowerCase()) ? -1 : t < e ? 1 : 0 }

    function compareInts(e, t) { return e < t ? -1 : t < e ? 1 : 0 }

    function HTMLEncode(e) {
        for (var t = e.length, n = []; t--;) {
            var a = e[t].charCodeAt();
            a < 65 || 127 < a || 90 < a && a < 97 ? (65533 == a && (a = 176), n[t] = "&#" + a + ";") : n[t] = e[t]
        }
        return n.join("")
    }

    function decode_entitie(e) { var t = document.createElement("div"); return t.innerHTML = e, e = t.textContent, t.textContent = "", e }
    var socket_response = "",
        socket_is_settings = !1;

    function process_socket_response(e) { e.split("\n").forEach(grblHandleMessage) }

    function cameraformataddress() {
        var e = id("camera_webaddress").value,
            t = e.trim().toLowerCase();
        0 < (e = e.trim()).length && -1 == t.indexOf("https://") && -1 == t.indexOf("http://") && -1 == t.indexOf("rtp://") && -1 == t.indexOf("rtps://") && -1 == t.indexOf("rtp://") && (e = "http://" + e), id("camera_webaddress").value = e
    }

    function camera_loadframe() { 0 == id("camera_webaddress").value.trim().length ? (id("camera_frame").src = "", displayNone("camera_frame_display"), displayNone("camera_detach_button")) : (cameraformataddress(), id("camera_frame").src = id("camera_webaddress").value, displayBlock("camera_frame_display"), displayTable("camera_detach_button")) }

    function camera_OnKeyUp(e) { return 13 == e.keyCode && camera_loadframe(), !0 }

    function camera_saveaddress() { cameraformataddress(), preferenceslist[0].camera_address = HTMLEncode(id("camera_webaddress").value), SavePreferences(!0) }

    function camera_detachcam() {
        var e = id("camera_frame").src;
        id("camera_frame").src = "", displayNone("camera_frame_display"), displayNone("camera_detach_button"), window.open(e)
    }

    function camera_GetAddress() { void 0 !== preferenceslist[0].camera_address ? id("camera_webaddress").value = decode_entitie(preferenceslist[0].camera_address) : id("camera_webaddress").value = "" }
    var CustomCommand_history = [],
        CustomCommand_history_index = -1,
        Monitor_output = [];

    function init_command_panel() {}

    function Monitor_output_autoscrollcmd() { id("cmd_content").scrollTop = id("cmd_content").scrollHeight }

    function Monitor_check_autoscroll() { 1 == id("monitor_enable_autoscroll").checked && Monitor_output_autoscrollcmd() }

    function Monitor_check_verbose_mode() { Monitor_output_Update() }

    function Monitor_output_Clear() { Monitor_output = [], Monitor_output_Update() }

    function Monitor_output_Update(t) {
        if (t) {
            if ("string" == typeof t || t instanceof String) Monitor_output = Monitor_output.concat(t);
            else try {
                var e = JSON.stringify(t, null, " ");
                Monitor_output = Monitor_output.concat(e + "\n")
            } catch (e) { Monitor_output = Monitor_output.concat(t.toString() + "\n") } Monitor_output = Monitor_output.slice(-300)

            // Trigger RSS feed update on RSS events
            if (t.startsWith("[MSG:RSS")) {
                rss_refreshFeed();
            }
            // Trigger SD file update on file download completed event or mount/unmount
            if (t.startsWith("[MSG:INFO: File download completed]") || t.startsWith("[MSG:INFO: Mount_sd]") || t.startsWith("[MSG:INFO: Unmount_sd]")) {
                files_refreshFiles(files_currentPath);
            }

        }
        var n, a = "",
            i = id("monitor_enable_verbose_mode").checked;
        for (n of Monitor_output) { var o = n.trim(); if ("" !== o) { if (!i) { if ("wait" == o || o.startsWith("ok") || o.startsWith("[#]") || o.startsWith("x:") || o.startsWith("fr:") || o.startsWith("echo:") || o.startsWith("Config:") || o.startsWith('echo:Unknown command: "echo"') || o.startsWith('echo:enqueueing "*"')) continue; if (o.startsWith("<") || o.startsWith("[echo:")) continue } a += n = (n = (n = (n = (n = (n = n.startsWith("[#]") ? n.replace("[#]", "") : n).replace("&", "&amp;")).replace("<", "&lt;")).replace(">", "&gt;")).startsWith("ALARM:") || n.startsWith("Hold:") || n.startsWith("Door:") ? "<font color='orange'><b>" + n + translate_text_item(n.trim()) + "</b></font>\n" : n).startsWith("error:") ? "<font color='red'><b>" + n.toUpperCase() + translate_text_item(n.trim()) + "</b></font>\n" : n } } t = id("cmd_content").innerHTML;
        (id("cmd_content").innerHTML = a) != t && Monitor_check_autoscroll()
    }

    function SendCustomCommand() {
        var e = id("custom_cmd_txt").value;
        0 != (e = e.trim()).trim().length && (CustomCommand_history.push(e), CustomCommand_history.slice(-40), CustomCommand_history_index = CustomCommand_history.length, id("custom_cmd_txt").value = "", Monitor_output_Update(e + "\n"), SendGetHttp("/command?commandText=" + (e = (e = encodeURI(e)).replace("#", "%23")), SendCustomCommandSuccess, SendCustomCommandFailed))
    }

    function CustomCommand_OnKeyUp(e) { return 13 == e.keyCode && SendCustomCommand(), 38 != e.keyCode && 40 != e.keyCode || (38 == e.keyCode && 0 < CustomCommand_history.length && 0 < CustomCommand_history_index ? CustomCommand_history_index-- : 40 == e.keyCode && CustomCommand_history_index < CustomCommand_history.length - 1 && CustomCommand_history_index++, 0 <= CustomCommand_history_index && CustomCommand_history_index < CustomCommand_history.length && (id("custom_cmd_txt").value = CustomCommand_history[CustomCommand_history_index]), !1) }

    function SendCustomCommandSuccess(e) { Monitor_output_Update("\n" == e[e.length - 1] ? e : e + "\n"); for (var t of e.split("\n")) process_socket_response(t) }

    function SendCustomCommandFailed(e, t) { Monitor_output_Update(0 == e ? translate_text_item("Connection error") + "\n" : translate_text_item("Error : ") + e + " :" + decode_entitie(t) + "\n"), console.log("cmd Error " + e + " :" + decode_entitie(t)) }
    var config_configList = [],
        config_override_List = [],
        config_lastindex = -1,
        config_error_msg = "",
        config_lastindex_is_override = !1,
        commandtxt = "$$",
        is_override_config = !1,
        config_file_name = "/sd/config";

    function refreshconfig(e) { http_communication_locked ? id("config_status").innerHTML = translate_text_item("Communication locked by another process, retry later.") : (is_override_config = !1, config_display_override(is_override_config = void 0 !== e && e ? e : is_override_config), displayBlock("config_loader"), displayNone("config_list_content"), displayNone("config_status"), displayNone("config_refresh_btn"), e || (config_configList = []), config_override_List = [], getprinterconfig(is_override_config)) }

    function config_display_override(e) { e ? (displayBlock("config_overrdisplayBlocke_list_content"), displayNone("config_main_content"), id("config_override_file").checked = !0) : (id("config_overrdisplayNonee_list_content"), displayBlock("config_main_content"), id("config_main_file").checked = !0) }

    function getprinterconfig(e) {
        var t = commandtxt;
        is_override_config = !(void 0 === e || !e) && (t = "M503", config_override_List = [], !0), SendGetHttp("/command?plain=" + encodeURIComponent(t))
    }

    function Apply_config_override() { SendGetHttp("/command?plain=" + encodeURIComponent("M500"), getESPUpdateconfigSuccess) }

    function Delete_config_override() { SendGetHttp("/command?plain=" + encodeURIComponent("M502"), getESPUpdateconfigSuccess) }

    function getESPUpdateconfigSuccess(e) { refreshconfig(!0) }

    function build_HTML_config_list() {
        var e = "",
            t = config_configList.length;
        is_override_config && (t = config_override_List.length);
        for (var n = 0; n < t; n++) {
            var a, i = "";
            is_override_config ? (a = config_override_List[n], i = "_override") : a = config_configList[n], e += "<tr>", a.showcomment ? (e += "<td colspan='3' class='info'>", e += a.comment) : (e += "<td style='vertical-align:middle'>", e += a.label, e += "</td>", e += "<td style='vertical-align:middle;'>", e += "<table><tr><td>", e += "<div id='status_config_" + i + n + "' class='form-group has-feedback' style='margin: auto;'>", e += "<div class='item-flex-row'>", e += "<table><tr><td>", e += "<div class='input-group'>", e += "<span class='input-group-btn'>", e += "<button class='btn btn-default btn-svg' onclick='config_revert_to_default(" + n + "," + is_override_config + ")' >", e += get_icon_svg("repeat"), e += "</button>", e += "</span>", e += "<input class='hide_it'></input>", e += "</div>", e += "</td><td>", e += "<div class='input-group'>", e += "<span class='input-group-addon hide_it' ></span>", e += "<input id='config_" + i + n + "' type='text' class='form-control' style='width:", e += "auto", e += "'  value='" + a.defaultvalue + "' onkeyup='config_checkchange(" + n + "," + is_override_config + ")' />", e += "<span id='icon_config_" + i + n + "'class='form-control-feedback ico_feedback' ></span>", e += "<span class='input-group-addon hide_it' ></span>", e += "</div>", e += "</td></tr></table>", e += "<div class='input-group'>", e += "<input class='hide_it'></input>", e += "<span class='input-group-btn'>", e += "<button  id='btn_config_" + i + n + "' class='btn btn-default' onclick='configGetvalue(" + n + "," + is_override_config + ")' translate english_content='Set' >" + translate_text_item("Set") + "</button>&nbsp;", e += "</span>", e += "</div>", e += "</div>", e += "</div>", e += "</td></tr></table>", e += "</td>", e += "<td style='vertical-align:middle'>", e += a.help), e += "</td>", e += "</tr>\n"
        }
        0 < e.length && (id("config_list_data").innerHTML = e), displayNone("config_loader"), displayBlock("config_list_content"), displayNone("config_status"), displayBlock("config_refresh_btn")
    }

    function config_check_value(e, t, n) { var a = !0; return "-" != e.trim()[0] && 0 !== e.length && -1 == e.toLowerCase().indexOf("#") || (a = !1, config_error_msg = translate_text_item("cannot have '-', '#' char or be empty")), a }

    function process_config_answer(e) { for (var t = !0, n = e.split("\n"), a = 0, i = 0; i < n.length; i++) a = create_config_entry(n[i], a); return 0 < a ? build_HTML_config_list() : t = !1, t }

    function create_config_entry(e, t) {
        if (!is_config_entry(n = e)) return t;
        for (; - 1 < n.indexOf("\t");) n = n.replace("\t", " ");
        for (; - 1 < n.indexOf("  ");) n = n.replace("  ", " ");
        for (; - 1 < n.indexOf("##");) n = n.replace("##", "#");
        if (is_config_commented(n)) {
            for (; - 1 != n.indexOf("<");) var n = n.replace("<", "&lt;").replace(">", "&gt;");
            var a = { comment: n, showcomment: !0, index: t, label: "", help: "", defaultvalue: "", cmd: "" };
            (is_override_config ? config_override_List : config_configList).push(a)
        } else {
            var i = get_config_label(n),
                e = get_config_value(n),
                a = { comment: n, showcomment: !1, index: t, label: i, help: get_config_help(n), defaultvalue: e, cmd: get_config_command(n), is_override: is_override_config };
            (is_override_config ? config_override_List : config_configList).push(a)
        }
        return ++t
    }

    function is_config_entry(e) { e = e.trim(); return 0 != e.length && (0 == e.indexOf("$") && -1 != e.indexOf("=")) }

    function get_config_label(e) { e.trim().split(" ").length; return e.trim().split("=")[0] }

    function get_config_value(e) {
        e.trim().split(" ");
        e = e.trim().split("=");
        return 1 < e.length ? e[1] : "???"
    }

    function get_config_help(e) { return is_override_config ? "" : inline_help(get_config_label(e)) }

    function get_config_command(e) { return get_config_label(e) + "=" }

    function is_config_commented(e) { e = e.trim(); return 0 != e.length && (!!is_override_config && e.startsWith(";")) }

    function config_revert_to_default(e, t) {
        var n = "",
            a = config_configList[e];
        t && (n = "_override", a = config_override_List[e]), console.log(), id("config_" + n + e).value = a.defaultvalue, id("btn_config_" + n + e).className = "btn btn-default", id("status_config_" + n + e).className = "form-group has-feedback", id("icon_config_" + n + e).innerHTML = ""
    }

    function is_config_override_file() {
        if (5 < config_override_List.length)
            for (i = 0; i < 5; i++)
                if (config_override_List[i].comment.startsWith("; No config override")) return !0;
        return !1
    }

    function configGetvalue(e, t) {
        var n, a = "",
            i = config_configList[e];
        t && (a = "_override", i = config_override_List[e]), value = id("config_" + a + e).value.trim(), value != i.defaultvalue && (config_check_value(value, e, t) ? (n = i.cmd + value, config_lastindex = e, config_lastindex_is_override = t, i.defaultvalue = value, id("btn_config_" + a + e).className = "btn btn-success", id("icon_config_" + a + e).className = "form-control-feedback has-success ico_feedback", id("icon_config_" + a + e).innerHTML = get_icon_svg("ok"), id("status_config_" + a + e).className = "form-group has-feedback has-success", SendGetHttp("/command?plain=" + encodeURIComponent(n), setESPconfigSuccess, setESPconfigfailed)) : (id("btn_config_" + a + e).className = "btn btn-danger", id("icon_config_" + a + e).className = "form-control-feedback has-error ico_feedback", id("icon_config_" + a + e).innerHTML = get_icon_svg("remove"), id("status_config_" + a + e).className = "form-group has-feedback has-error", alertdlg(translate_text_item("Out of range"), translate_text_item("Value ") + config_error_msg + " !")))
    }

    function config_checkchange(e, t) {
        var n = "",
            a = config_configList[e];
        t && (n = "_override", a = config_override_List[e]);
        var i = id("config_" + n + e).value.trim();
        a.defaultvalue == i ? (id("btn_config_" + n + e).className = "btn btn-default", id("icon_config_" + n + e).className = "form-control-feedback", id("icon_config_" + n + e).innerHTML = "", id("status_config_" + n + e).className = "form-group has-feedback") : config_check_value(i, e, t) ? (id("status_config_" + n + e).className = "form-group has-feedback has-warning", id("btn_config_" + n + e).className = "btn btn-warning", id("icon_config_" + n + e).className = "form-control-feedback has-warning ico_feedback", id("icon_config_" + n + e).innerHTML = get_icon_svg("warning-sign")) : (id("btn_config_" + n + e).className = "btn btn-danger", id("icon_config_" + n + e).className = "form-control-feedback has-error ico_feedback", id("icon_config_" + n + e).innerHTML = get_icon_svg("remove"), id("status_config_" + n + e).className = "form-group has-feedback has-error")
    }

    function setESPconfigSuccess(e) {}
    var grbl_help = { $0: "Step pulse, microseconds", $1: "Step idle delay, milliseconds", $2: "Step port invert, mask", $3: "Direction port invert, mask", $4: "Step enable invert, boolean", $5: "Limit pins invert, boolean", $6: "Probe pin invert, boolean", $10: "Status report, mask", $11: "Junction deviation, mm", $12: "Arc tolerance, mm", $13: "Report inches, boolean", $20: "Soft limits, boolean", $21: "Hard limits, boolean", $22: "Homing cycle, boolean", $23: "Homing dir invert, mask", $24: "Homing feed, mm/min", $25: "Homing seek, mm/min", $26: "Homing debounce, milliseconds", $27: "Homing pull-off, mm", $30: "Max spindle speed, RPM", $31: "Min spindle speed, RPM", $32: "Laser mode, boolean", $100: "X steps/mm", $101: "Y steps/mm", $102: "Z steps/mm", $103: "A steps/mm", $104: "B steps/mm", $105: "C steps/mm", $110: "X Max rate, mm/min", $111: "Y Max rate, mm/min", $112: "Z Max rate, mm/min", $113: "A Max rate, mm/min", $114: "B Max rate, mm/min", $115: "C Max rate, mm/min", $120: "X Acceleration, mm/sec^2", $121: "Y Acceleration, mm/sec^2", $122: "Z Acceleration, mm/sec^2", $123: "A Acceleration, mm/sec^2", $124: "B Acceleration, mm/sec^2", $125: "C Acceleration, mm/sec^2", $130: "X Max travel, mm", $131: "Y Max travel, mm", $132: "Z Max travel, mm", $133: "A Max travel, mm", $134: "B Max travel, mm", $135: "C Max travel, mm" };

    function inline_help(e) { var t = ""; return translate_text_item(t = void 0 === (t = grbl_help[e]) ? "" : t) }

    function setESPconfigfailed(e, t) {
        alertdlg(translate_text_item("Set failed"), "Error " + e + " :" + t), console.log("Error " + e + " :" + t);
        t = config_lastindex_is_override ? "_override" : "";
        id("btn_config_" + t + config_lastindex).className = "btn btn-danger", id("icon_config_" + t + config_lastindex).className = "form-control-feedback has-error ico_feedback", id("icon_config_" + t + config_lastindex).innerHTML = get_icon_svg("remove"), id("status_config_" + t + config_lastindex).className = "form-group has-feedback has-error"
    }

    function getESPconfigSuccess(e) { process_config_answer(e) || (getESPconfigfailed(406, translate_text_item("Wrong data")), displayNone("config_loader"), displayBlock("config_list_content"), displayNone("config_status"), displayBlock("config_refresh_btn")) }

    function getESPconfigfailed(e, t) { console.log("Error " + e + " :" + t), displayNone("config_loader"), displayBlock("config_status"), id("config_status").innerHTML = translate_text_item("Failed:") + e + " " + t, displayBlock("config_refresh_btn") }

    function confirmdlg(e, t, n) {
        var a = setactiveModal("confirmdlg.html", n);
        null != a && (n = a.element.getElementsByClassName("modal-title")[0], a = a.element.getElementsByClassName("modal-text")[0], n.innerHTML = e, a.innerHTML = t, showModal())
    }

    function connectdlg(e) {
        var t = !0;
        null != setactiveModal("connectdlg.html") && (showModal(), (t = void 0 !== e ? e : t) && retryconnect())
    }

    function getFWdata(e) {
        var t = e.split("#");
        if (t.length < 3) return !1;
        var n = t[0].split(":");
        if (2 != n.length) return !1;
        if (fw_version = n[1].toLowerCase().trim(), 2 != (n = t[1].split(":")).length) return !1;
        if (target_firmware = n[1].toLowerCase().trim(), 2 != (n = t[2].split(":")).length) return !1;
        e = n[1].toLowerCase().trim();
        return direct_sd = "direct sd" == e, 2 == (n = t[3].split(":")).length && (primary_sd = n[1].toLowerCase().trim(), 2 == (n = t[4].split(":")).length && (secondary_sd = n[1].toLowerCase().trim(), 2 == (n = t[5].split(":")).length && (ESP3D_authentication = "authentication" == n[0].trim() && "yes" == n[1].trim(), 6 < t.length && ("webcommunication" == (n = t[6].split(":"))[0].trim() && "Async" == n[1].trim() ? async_webcommunication = !0 : (async_webcommunication = !1, websocket_port = n[2].trim(), websocket_ip = 3 < n.length ? n[3].trim() : (console.log("No IP for websocket, use default"), document.location.hostname))), 7 < t.length && "hostname" == (n = t[7].split(":"))[0].trim() && (esp_hostname = n[1].trim()), 8 < t.length && "axis" == (n = t[8].split(":"))[0].trim() && (grblaxis = parseInt(n[1].trim())), async_webcommunication && window.EventSource && ((event_source = new EventSource("/events")).addEventListener("InitID", Init_events, !1), event_source.addEventListener("ActiveID", ActiveID_events, !1), event_source.addEventListener("DHT", DHT_events, !1)), startSocket(), !0)))
    }

    function connectsuccess(e) { getFWdata(e) ? (console.log("Fw identification:" + e), ESP3D_authentication ? (closeModal("Connection successful"), displayInline("menu_authentication"), logindlg(initUI, !0)) : (displayNone("menu_authentication"), initUI())) : (console.log(e), connectfailed(406, "Wrong data")) }

    function connectfailed(e, t) { displayBlock("connectbtn"), displayBlock("failed_connect_msg"), displayNone("connecting_msg"), console.log("Fw identification error " + e + " : " + t) }

    function retryconnect() { displayNone("connectbtn"), displayNone("failed_connect_msg"), displayBlock("connecting_msg"), SendGetHttp("/command?plain=" + encodeURIComponent("[ESP800]"), connectsuccess, connectfailed) }
    var interval_position = -1,
        control_macrolist = [];

    function init_controls_panel() { loadmacrolist() }

    function hideAxiscontrols() { displayNone("JogBar"), displayNone("HomeZ"), displayBlock("CornerZ"), displayNone("control_z_position_display"), displayNone("control_zm_position_row"), displayNone("z_velocity_display") }

    function showAxiscontrols() { displayNone("CornerZ"), 
                                  displayBlock("JogBar"), 
                                  //displayBlock("HomeZ"), 
                                  //displayBlock("control_z_position_display"), 
                                  //displayTable("control_zm_position_row"), 
                                  displayInline("z_velocity_display") }

    function loadmacrolist() {
        control_macrolist = [];
        SendGetHttp("/macrocfg.json", processMacroGetSuccess, processMacroGetFailed)
    }

    function Macro_build_list(e) {
        var t = [];
        try { 0 != e.length && (t = JSON.parse(e)) } catch (e) { console.error("Parsing error:", e) }
        for (var n = 0; n < 9; n++) {
            var a = 0 != t.length && void 0 !== t[n].name && void 0 !== t[n].glyph && void 0 !== t[n].filename && void 0 !== t[n].target && void 0 !== t[n].class && void 0 !== t[n].index ? { name: t[n].name, glyph: t[n].glyph, filename: t[n].filename, target: t[n].target, class: t[n].class, index: t[n].index } : { name: "", glyph: "", filename: "", target: "", class: "", index: n };
            control_macrolist.push(a)
        }
        control_build_macro_ui()
    }

    function processMacroGetSuccess(e) {-1 == e.indexOf("<HTML>") ? Macro_build_list(e) : Macro_build_list("") }

    function processMacroGetFailed(e, t) { console.log("Error " + e + " : " + t), Macro_build_list("") }

    function on_autocheck_position(e) { void 0 !== e && (id("autocheck_position").checked = e), interval_position = id("autocheck_position").checked ? (e = parseInt(id("posInterval_check").value), !isNaN(e) && 0 < e && e < 100 ? (-1 != interval_position && clearInterval(interval_position), setInterval(function() { get_Position() }, 1e3 * e)) : (id("autocheck_position").checked = !1, id("posInterval_check").value = 0, -1 != interval_position && clearInterval(interval_position), -1)) : (-1 != interval_position && clearInterval(interval_position), -1) }

    function onPosIntervalChange() { var e = parseInt(id("posInterval_check").value);!isNaN(e) && 0 < e && e < 100 || (id("autocheck_position").checked = !1, (id("posInterval_check").value = 0) != e && alertdlg(translate_text_item("Out of range"), translate_text_item("Value of auto-check must be between 0s and 99s !!"))), on_autocheck_position() }

    function get_Position() { SendPrinterCommand("?", !1, null, null, 114, 1) }

    function Control_get_position_value(e, t) {
        var n = "",
            a = t.indexOf(e, 0);
        return -1 < a && (a += e.length, n = -1 < (e = t.indexOf(" ", a)) ? t.substring(a, e) : t.substring(a)), n.trim()
    }

    function process_Position(e) { grblProcessStatus(e) }

    function control_motorsOff() { SendPrinterCommand("$Motors/Disable", !0) }

    function SendHomecommand(e) {
        if (!id("lock_UI").checked) {
            switch (e) {
                case "G28":
                    e = "$H";
                    break;
                case "G28 X0":
                    e = "$HX";
                    break;
                case "G28 Y0":
                    e = "$HY";
                    break;
                case "G28 Z0":
                    e = 3 < grblaxis ? "$H" + id("control_select_axis").value : "$HZ";
                    break;
                default:
                    e = "$H"
            }
            SendPrinterCommand(e, !0, get_Position)
        }
    }

    function SendZerocommand(e) { SendPrinterCommand("G10 L20 P0 " + e, !0, get_Position) }

    function JogFeedrate(e) { e = e.startsWith("Z") ? "control_z_velocity" : "control_xy_velocity", e = parseInt(id(e).value); return e < 1 || isNaN(e) || null === e ? (alertdlg(translate_text_item("Out of range"), translate_text_item("Feedrate value must be at least 1 mm/min!")), 1) : e }

    function getSelectedPen() {
        var selectElement = document.getElementById('penDropdown');
        var selectedValue = selectElement.options[selectElement.selectedIndex].value;
        var selectedText = selectElement.options[selectElement.selectedIndex].text;
        
        // Now, you can use the selectedValue or selectedText as needed
        console.log("Selected value: " + selectedValue);
        console.log("Selected text: " + selectedText);
      }

    function TestOffsetCommandBT(){
        // We are going to want to steal SendPrinterCommand
        var penDropdown = document.getElementById('penDropdown');
        var selectedPen = penDropdown.options[penDropdown.selectedIndex].value;
        var z_offset = document.getElementById('floatselect').value;
        var cmd = "G0Z3\rG0X20\rG1Z" + z_offset + " F1000\rG0X177\rG0Z0 F1000\rG0Z3\rG0X20\r";
        SendPrinterCommand(cmd, false);

        console.log("SetPenOffsetBT Caled with pen: " + selectedPen + ", offset = " + z_offset);
        console.log("Cmd: " + cmd);
    }

    function SetOffsetCommandBT(){
        var selectedPen = penDropdown.options[penDropdown.selectedIndex].value.at(-1);
        var z_offset = document.getElementById('floatselect').value;
        var cmd = "G10L2P" + selectedPen + "X0Y0Z" + z_offset;
        SendPrinterCommand(cmd, false);
        console.log("SetOffsetCommandBT Called. CMD: " + cmd);
    }

    function sendJogBT(axis, direction) { 
        var dir; 
        var feedrate; 

        console.log("sendJogBT called with axis: " + axis + ", and direction: " + direction); 

        (axis === 'Z') ? (feedrate = 'Zfeedrate') : (feedrate = 'XYfeedrate'); 
        (direction === 'N') ? (dir = '-') : (dir = ''); 

        var cmd = axis + dir + jogStep; console.log("Cmd generated"); 
        console.log("Cmd: " + cmd + " Feedrate: " + feedrate); 
        
        SendJogcommand(cmd, feedrate);
    }

    async function SendJogcommand(e, t) { 

        await checkHomed();
        if (homed == 0) { infodlg(translate_text_item("Machine not homed"), translate_text_item("Please home your machine first")); return; }

        if(jogStep === 'undefined') {
            console.log("jogStep is undefined. Select a jog distance."); 
            return;
        } 

        if (!id("lock_UI").checked) {
            var n, a = ""; 
            if ("XYfeedrate" == t) { 
                if ((a = parseInt(id("control_xy_velocity").value)) < 1 || isNaN(a) || null === a) return alertdlg(translate_text_item("Out of range"), translate_text_item("XY Feedrate value must be at least 1 mm/min!")), void(id("control_xy_velocity").value = preferenceslist[0].xy_feedrate) 
            } else if ((a = parseInt(id("control_z_velocity").value)) < 1 || isNaN(a) || null === a) { 
                var i = 3 < grblaxis ? "Axis" : "Z"; return alertdlg(translate_text_item("Out of range"), translate_text_item(i + " Feedrate value must be at least 1 mm/min!")), void(id("control_z_velocity").value = preferenceslist[0].z_feedrate) 
            } 
            3 < grblaxis && (i = id("control_select_axis").value, e = e.replace("Z", i)), n = "$J=G91 G21 F" + a + " " + e, console.log(n), SendPrinterCommand(n, !0, get_Position) 
        }
    }

    function confirmSelection() {
        var confirmation = window.confirm("Intended for Developer/Advanced Users Only");
        if (confirmation) {
            // User clicked "OK"
            build_HTML_setting_list('tree');
        } else {
            // User clicked "Cancel"
            // Deselect the radio button
            document.getElementById('tree_setting_filter').checked = false;
        }
    }

    function onXYvelocityChange() {
        var e = parseInt(id("control_xy_velocity").value);
        e < 1 || 9999 < e || isNaN(e)
    }

    function onZvelocityChange() {
        var e = parseInt(id("control_z_velocity").value);
        e < 1 || 999 < e || isNaN(e)
    }

    function processMacroSave(e) { "ok" == e && control_build_macro_ui() }

    function control_build_macro_button(e) {
        var t = "",
            n = control_macrolist[e];
        return t += "<button class='btn fixedbutton " + control_macrolist[e].class + "' type='text' ", 0 == n.glyph.length && (t += "style='display:none'"), t += "onclick='macro_command (\"" + n.target + '","' + n.filename + "\")'", t += "><span style='position:relative; top:3px;'>", 0 == n.glyph.length ? t += get_icon_svg("star") : t += get_icon_svg(n.glyph), t += "</span>", 0 < n.name.length && (t += "&nbsp;"), t += n.name, t += "</button>"
    }

    function control_build_macro_ui() {
        var e = "<div class='tooltip'>";
        e += "<span class='tooltip-text'>Manage macros</span>", e += "<button class='btn btn-primary' onclick='showmacrodlg(processMacroSave)'>", e += "<span class='badge'>", e += "<svg width='1.3em' height='1.2em' viewBox='0 0 1300 1200'>", e += "<g transform='translate(50,1200) scale(1, -1)'>", e += "<path  fill='currentColor' d='M407 800l131 353q7 19 17.5 19t17.5 -19l129 -353h421q21 0 24 -8.5t-14 -20.5l-342 -249l130 -401q7 -20 -0.5 -25.5t-24.5 6.5l-343 246l-342 -247q-17 -12 -24.5 -6.5t-0.5 25.5l130 400l-347 251q-17 12 -14 20.5t23 8.5h429z'></path>", e += "</g>", e += "</svg>", e += "<svg width='1.3em' height='1.2em' viewBox='0 0 1300 1200'>", e += "<g transform='translate(50,1200) scale(1, -1)'>", e += "<path  fill='currentColor' d='M1011 1210q19 0 33 -13l153 -153q13 -14 13 -33t-13 -33l-99 -92l-214 214l95 96q13 14 32 14zM1013 800l-615 -614l-214 214l614 614zM317 96l-333 -112l110 335z'></path>", e += "</g>", e += "</svg>", e += "</span>", e += "</button>", e += "</div>";
        for (var t = 0; t < 9; t++) e += control_build_macro_button(t);
        id("Macro_list").innerHTML = e
    }

    function macro_command(e, t) {
        var n = "";
        if ("ESP" == e) n = "$LocalFS/Run=" + t;
        else if ("SD" == e) files_print_filename(t);
        else {
            if ("URI" != e) return;
            window.open(t)
        }
        SendPrinterCommand(n)
    }

    function creditsdlg() { null != setactiveModal("creditsdlg.html") && showModal() }

    function process_Custom(response) {
        var freq = 440,
            dur = 100;
        response = response.replace("[esp3d]", ""), response.startsWith("eop") && beep(dur, freq), response.startsWith("beep(") && eval(response)
    }

    function clear_drop_menu(e) {
        var e = get_parent_by_class(e.target, "dropdownselect"),
            t = "-1";
        null !== e && void 0 !== e.id && (t = e.id);
        for (var n = classes("dropmenu-content"), a = 0; a < n.length; a++) {
            var i = get_parent_by_class(n[a], "dropdownselect");
            null !== i && void 0 !== i.id && i.id != t && n[a].classList.contains("show") && n[a].classList.remove("show")
        }
    }

    function get_parent_by_class(e, t) { return null == e ? null : e.classList.contains(t) ? e : get_parent_by_class(e.parentElement, t) }

    function hide_drop_menu(e) {
        e = get_parent_by_class(e.target, "dropmenu-content");
        void 0 !== e && e.classList.contains("show") && e.classList.remove("show")
    }

    function showhide_drop_menu(e) {
        e = get_parent_by_class(e.target, "dropdownselect");
        null === e || void 0 !== (e = e.getElementsByClassName("dropmenu-content")[0]) && e.classList.toggle("show")
    }
    var files_currentPath = "/",
        files_filter_sd_list = !1,
        files_file_list = [],
        files_status_list = [],
        files_current_file_index = -1,
        files_error_status = "",
        tfiles_filters, tft_sd = "SD:",
        tft_usb = "U:",
        printer_sd = "SDCARD:",
        current_source = "/",
        last_source = "/";

    function build_file_filter_list(e) { build_accept(e), update_files_list() }

    function update_files_list() {
        if (0 != files_file_list.length) {
            for (var e = 0; e < files_file_list.length; e++) {
                var t = files_file_list[e].isdir,
                    n = files_file_list[e].name;
                files_file_list[e].isprintable = files_isgcode(n, t)
            }
            files_build_display_filelist()
        }
    }

    function build_accept(e) {
        var t = "";
        if (void 0 !== e) {
            tfiles_filters = e.trim().split(";");
            for (var n = 0; n < tfiles_filters.length; n++) {
                var a = tfiles_filters[n].trim();
                0 < a.length && (0 < t.length && (t += ", "), t += "." + a)
            }
        }
        0 == t.length && (t = "*, *.*", tfiles_filters = ""), id("files_input_file").accept = t, console.log(t)
    }

    function init_files_panel(e) { displayInline("files_refresh_btn"), displayNone("files_refresh_primary_sd_btn"), displayNone("files_refresh_secondary_sd_btn"), files_set_button_as_filter(files_filter_sd_list), direct_sd && (void 0 !== e ? e : !0) && files_refreshFiles(files_currentPath) }

    function init_rss_panel(e) { displayInline("rss_refresh_btn"), syncRssFeed() }

    function files_set_button_as_filter(e) { id("files_filter_glyph").innerHTML = get_icon_svg(e ? "list-alt" : "filter", "1em", "1em") }

    function files_filter_button(e) { files_set_button_as_filter(files_filter_sd_list = !files_filter_sd_list), files_build_display_filelist() }

    function formatFileSize(e) { return nSize = Number(e), isNaN(nSize) ? e : 1e12 < nSize ? (nFix = nSize / 1e12, nFix.toFixed(2) + " TB") : 1e9 < nSize ? (nFix = nSize / 1e9, nFix.toFixed(2) + " GB") : 1e6 < nSize ? (nFix = nSize / 1e6, nFix.toFixed(2) + " MB") : 1e3 < nSize ? (nFix = nSize / 1e3, nFix.toFixed(2) + " KB") : nSize + " B" }

    function files_build_file_line(e) {
        var t, n, a, i = "",
            o = files_file_list[e],
            r = files_is_clickable(e);
        return (files_filter_sd_list && o.isprintable || !files_filter_sd_list) && (i += "<li class='list-group-item list-group-hover' >", i += "<div class='row'>", i += "<div class='col-md-5 col-sm-5 no_overflow' ", r && (i += "style='cursor:pointer;' onclick='files_click_file(" + e + ")'"), i += "><table><tr><td><span  style='color:DeepSkyBlue;'>", 1 == o.isdir ? i += get_icon_svg("folder-open") : i += get_icon_svg("file"), i += "</span ></td><td>", i += o.name, i += "</td></tr></table></div>", a = "col-md-2 col-sm-2 filesize", t = "col-md-3 col-sm-3", n = "col-md-2 col-sm-2", o.isdir || "" != o.datetime || (a = "col-md-4 col-sm-4 filesize", t = "hide_it", n = "col-md-3 col-sm-3"), i += "<div class='" + a + "'", r && (i += "style='cursor:pointer;' onclick='files_click_file(" + e + ")' "), a = formatFileSize(o.size), i += ">" + (a = o.isdir ? "" : a) + "</div>", i += "<div class='" + t + "'", r && (i += "style='cursor:pointer;' onclick='files_click_file(" + e + ")' "), i += ">" + o.datetime + "</div>", i += "<div class='" + n + "'>", i += "<div class='pull-right'>", o.isprintable && (i += "<button class='btn btn-xs btn-default'  onclick='files_print(" + e + ")' style='padding-top: 4px;'>", i += get_icon_svg("play", "1em", "1em"), i += "</button>"), i += "&nbsp;", files_showdeletebutton(e) && (i += "<button class='btn btn-xs btn-danger' onclick='files_delete(" + e + ")'  style='padding-top: 4px;'>" + get_icon_svg("trash", "1em", "1em") + "</button>"), i += "</div>", i += "</div>", i += "</div>", i += "</li>"), i
    }

    function files_print(e) {
        var t = files_file_list[e],
            e = files_currentPath + t.name;
        tabletSelectGCodeFile(t.name), tabletLoadGCodeFile(e, t.size), files_print_filename(e)
    }

    function files_print_filename(e) { get_status(), "none" == reportType && tryAutoReport(), files_check_and_run(e) }

    async function files_check_and_run(e) {
        await checkHomed();
        if (homed == 0) { infodlg(translate_text_item("Machine not homed"), translate_text_item("Please home your machine first")); return; }
        SendPrinterCommand("$SD/Run=" + e)
    }

    function files_Createdir() { inputdlg(translate_text_item("Please enter directory name"), translate_text_item("Name:"), process_files_Createdir) }

    function process_files_Createdir(e) { 0 < e.length && files_create_dir(e.trim()) }

    function files_create_dir(e) { direct_sd && (e = "/upload?path=" + encodeURIComponent(files_currentPath) + "&action=createdir&filename=" + encodeURIComponent(e), displayBlock("files_nav_loader"), SendGetHttp(e, files_list_success, files_list_failed)) }

    function files_delete(e) {
        files_current_file_index = e;
        var t = translate_text_item("Confirm deletion of directory: ");
        files_file_list[e].isdir || (t = translate_text_item("Confirm deletion of file: ")), confirmdlg(translate_text_item("Please Confirm"), t + files_file_list[e].name, process_files_Delete)
    }

    function process_files_Delete(e) { "yes" == e && -1 != files_current_file_index && files_delete_file(files_current_file_index), files_current_file_index = -1 }

    function files_delete_file(e) {
        var t;
        files_error_status = "Delete " + files_file_list[e].name, direct_sd && (t = "/upload?path=" + encodeURIComponent(files_currentPath) + "&action=", files_file_list[e].isdir ? t += "deletedir&filename=" : t += "delete&filename=", t += encodeURIComponent(files_file_list[e].sdname), displayBlock("files_nav_loader"), SendGetHttp(t, files_list_success, files_list_failed))
    }

    function files_proccess_and_update(e) {
        if (displayBlock("files_navigation_buttons"), e.startsWith("{") && e.endsWith("}")) try { response = JSON.parse(e), void 0 !== response.status && (Monitor_output_Update(response.status + "\n"), files_error_status = response.status) } catch (e) { console.error("Parsing error:", e), response = "Error" } else "\n" != e[e.length - 1] ? Monitor_output_Update(e + "\n") : Monitor_output_Update(e), e = (e = (e = (e = e.replace("\nok", "")).replace(/\n/gi, "")).replace(/\r/gi, "")).trim(), console.log(e), 0 < e.length ? files_error_status = e : 0 == files_error_status.length && (files_error_status = "Done");
        files_refreshFiles(files_currentPath)
    }

    function files_is_clickable(e) { return !!files_file_list[e].isdir || direct_sd }

    function files_enter_dir(e) { files_refreshFiles(files_currentPath + e + "/", !0) }

    function files_click_file(e) {
        e = files_file_list[e];
        e.isdir ? files_enter_dir(e.name) : direct_sd && (e = "SD/" + files_currentPath + e.sdname, window.location.href = encodeURIComponent(e.replace("//", "/")))
    }

    function files_isgcode(e, t) { if (1 == t) return !1; if (void 0 === tfiles_filters) return !1; if (0 == tfiles_filters.length) return !0; for (var n = 0; n < tfiles_filters.length; n++) { var a = "." + tfiles_filters[n].trim(); if (e.endsWith(a)) return !0 } return !1 }

    function files_showdeletebutton(e) { return !0 }

    function cleanpath(e) { return e.trim(), e = "/" != (e = "/" != e[0] ? "/" + e : e) && e.endsWith("/") ? e.substr(0, e.length - 1) : e }

    function files_refreshFiles(e, t) {
        var n = e;
        files_currentPath = e, current_source != last_source && (e = files_currentPath = "/", last_source = current_source), (current_source == tft_sd || current_source == tft_usb ? displayNone : displayBlock)("print_upload_btn"), void 0 === t && (t = !1), id("files_currentPath").innerHTML = files_currentPath, files_file_list = [], files_build_display_filelist(!(files_status_list = [])), displayBlock("files_list_loader"), displayBlock("files_nav_loader"), direct_sd && SendGetHttp("/upload?path=" + encodeURI(n), files_list_success, files_list_failed)
    }

    var homed = 0;
    function timer(ms) { return new Promise(res => setTimeout(res, ms)); }

    async function checkHomed() { 
        console.log("Checking Homed");

        // Clear homing value
        homed = -1;

        // Send GET request
        SendGetHttp("/command?plain=" + encodeURIComponent("[ESP903]"), checkHomedSuccess);

        // Wait for valid homed flag from GET response
        while(homed < 0) {
            await timer(100);
        }
    }

    function checkHomedSuccess(e) {
        homed = e;
    }

    function rss_refreshFeed(e) { 
        displayBlock("rss_list_loader");
        SendGetHttp("/command?plain=" + encodeURIComponent("[ESP902]"), getRssFeedSuccess);
    }

    function getRssFeedSuccess(e) {
        process_rss_answer(e)
        displayNone("rss_list_loader")
    }

    var rss_feed = []
    function process_rss_answer(e) {
        var t = !0;
        rss_feed = [];
        try {
            var n = JSON.parse(e);
            if (void 0 === n.rss) t = !1, console.log("No RSS");
            else if (0 < n.rss.length) {
                for (var a = 0, i = 0; i < n.rss.length; i++) a = create_rss_entry(n.rss[i], a);
                0 < a ? (rss_build_display_feed()) : t = !1
            } else t = !1
        } catch (e) { console.error("Parsing error:", e), t = !1 }
        return t
    }

    function is_rss_entry(e) { return void 0 !== e.title && void 0 !== e.link && void 0 !== e.updated }

    function create_rss_entry(e, t) {
        if (!is_rss_entry(e)) return t;
        var u = { title: e.title, link: e.link, updated: parseInt(e.updated) };
        return rss_feed.push(u), ++t
    }

    function files_format_size(e) { e = parseInt(e); return e < 1024 ? e + " B" : e < 1048576 ? (e / 1024).toFixed(2) + " KB" : e < 1073741824 ? (e / 1024 / 1024).toFixed(2) + " MB" : (e / 1024 / 1024 / 1024).toFixed(2) + " GB" }

    function files_is_filename(e) {
        var t = !0,
            n = String(e),
            t = /^[^\\/:\*\?"<>\|]+$/.test(e) && !/^\./.test(e) && !/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i.test(e);
        return t = 0 == n.length || -1 != n.indexOf(":") || -1 != n.indexOf("..") ? !1 : t
    }

    function files_list_success(e) {
        displayBlock("files_navigation_buttons");
        var t, n = !1;
        try { t = JSON.parse(e) } catch (e) { console.error("Parsing error:", e), n = !0 }
        if (n || void 0 === t.status) files_list_failed(406, translate_text_item("Wrong data", !0));
        else {
            if (files_file_list = [], void 0 !== t.files)
                for (var a = 0; a < t.files.length; a++) {
                    var i = "",
                        o = !1,
                        r = "";
                    "-1" == t.files[a].size ? o = !0 : r = t.files[a].size;
                    var s = files_isgcode(i = t.files[a].name, o),
                        s = { name: i, sdname: i, size: r, isdir: o, datetime: t.files[a].datetime, isprintable: s };
                    files_file_list.push(s)
                }
            files_file_list.sort(function(e, t) { return e.name.localeCompare(t.name) });
            var l = "-1",
                e = "-1",
                n = "-1";
            void 0 !== t.total && (l = t.total), void 0 !== t.used && (e = t.used), void 0 !== t.occupation && (n = t.occupation), (files_status_list = []).push({ status: translate_text_item(t.status), path: t.path, used: e, total: l, occupation: n }), files_build_display_filelist()
        }
    }

    function files_list_failed(e, t) { displayBlock("files_navigation_buttons"), 0 != esp_error_code ? (alertdlg(translate_text_item("Error") + " (" + esp_error_code + ")", esp_error_message), esp_error_code = 0) : alertdlg(translate_text_item("Error"), translate_text_item("No connection")), files_build_display_filelist(!1) }

    function files_directSD_upload_failed(e, t) { 0 != esp_error_code ? (alertdlg(translate_text_item("Error") + " (" + esp_error_code + ")", esp_error_message), esp_error_code = 0) : alertdlg(translate_text_item("Error"), translate_text_item("Upload failed")), displayNone("files_uploading_msg"), displayBlock("files_navigation_buttons") }

    function need_up_level() { return "/" != files_currentPath }

    function files_go_levelup() {
        for (var e = files_currentPath.split("/"), t = "/", n = 1; n < e.length - 2;) t += e[n] + "/", n++;
        files_refreshFiles(t, !0)
    }

    function files_build_display_filelist(e) {
        if (void 0 === e && (e = !0), populateTabletFileSelector(files_file_list, files_currentPath), displayNone("files_uploading_msg"), displayNone("files_list_loader"), displayNone("files_nav_loader"), !e) return displayNone("files_status_sd_status"), displayNone("files_space_sd_status"), id("files_fileList").innerHTML = "", void displayNone("files_fileList");
        var t = "";
        need_up_level() && (t += "<li class='list-group-item list-group-hover' style='cursor:pointer' onclick='files_go_levelup()''>", t += "<span >" + get_icon_svg("level-up") + "</span>&nbsp;&nbsp;<span translate>Up...</span>", t += "</li>");
        for (var n = 0; n < files_file_list.length; n++) 0 == files_file_list[n].isdir && (t += files_build_file_line(n));
        for (n = 0; n < files_file_list.length; n++) files_file_list[n].isdir && (t += files_build_file_line(n));
        displayBlock("files_fileList"), id("files_fileList").innerHTML = t, 0 == files_status_list.length && "" != files_error_status && files_status_list.push({ status: files_error_status, path: files_currentPath, used: "-1", total: "-1", occupation: "-1" }), 0 < files_status_list.length ? ("-1" != files_status_list[0].total ? (id("files_sd_status_total").innerHTML = files_status_list[0].total, id("files_sd_status_used").innerHTML = files_status_list[0].used, id("files_sd_status_occupation").value = files_status_list[0].occupation, id("files_sd_status_percent").innerHTML = files_status_list[0].occupation, displayTable("files_space_sd_status")) : displayNone("files_space_sd_status"), "" == files_error_status || "ok" != files_status_list[0].status.toLowerCase() && 0 != files_status_list[0].status.length || (files_status_list[0].status = files_error_status), files_error_status = "", "ok" != files_status_list[0].status.toLowerCase() ? (id("files_sd_status_msg").innerHTML = translate_text_item(files_status_list[0].status, !0), displayTable("files_status_sd_status")) : displayNone("files_status_sd_status")) : displayNone("files_space_sd_status")
    }

    function syncRssFeed() { SendGetHttp("/command?plain=" + encodeURIComponent("[ESP901]plain")) } 

    function rss_throw_error(msg) {
        var content = ""
        
        content += "<li class='list-group-item list-group-hover' >";
        content += "<div class='row'>";
        content += "<div class='col-md-11 col-sm-11 no_overflow' ";
        content += "><table><tr><td><span  style='color:Red;'>"
        content += get_icon_svg("warning-sign");
        content += "</span ></td><td>&nbsp;";
        content += msg;
        content += "</td></tr></table></div>";
        content += "</div>";
        content += "</li>";

        return content;
    }

    function rss_build_feed_line(el) {
        
        var content = "";

        // Catch error entries
        if (el.link == "ERROR") {

            content += rss_throw_error(el.title);  // Use title as error message

        } else {

            if (el.updated)
                content += "<li class='list-group-item-new list-group-hover' >";
            else
                content += "<li class='list-group-item list-group-hover' >";
            content += "<div class='row'>";
            content += "<div class='col-md-5 col-sm-5 no_overflow' ";
            content += "><table><tr><td><span  style='color:DeepSkyBlue;'>";
            content += get_icon_svg("file");
            content += "</span ></td><td><a href='";
            content += el.link;
            content += "'>"
            content += el.title;
            content += "</a>"
            if (el.updated)
                content += "  *NEW*";
            content += "</td></tr></table></div>";
            content += "</div>";
            content += "</li>";
        }

        return content;
    }

    function rss_build_display_feed() {

        var t = ""
        rss_feed.forEach(el => {
            t += rss_build_feed_line(el);
        });
        
        displayBlock("rss_feedList"), id("rss_feedList").innerHTML = t
    }

    function files_abort() { SendPrinterCommand("abort") }

    function files_select_upload() { id("files_input_file").click() }

    function files_check_if_upload() {
        id("files_input_file").files;
        direct_sd ? SendPrinterCommand("[ESP200]", !1, process_check_sd_presence) : files_start_upload()
    }

    function process_check_sd_presence(e) { direct_sd && -1 < e.indexOf("o SD card") ? (alertdlg(translate_text_item("Upload failed"), translate_text_item("No SD card detected")), files_build_display_filelist(!(files_error_status = "No SD card")), id("files_sd_status_msg").innerHTML = translate_text_item(files_error_status, !0), displayTable("files_status_sd_status")) : files_start_upload() }

    function files_start_upload() {
        if (http_communication_locked) return alertdlg(translate_text_item("Busy..."), translate_text_item("Communications are currently locked, please wait and retry.")), void console.log("communication locked");
        var e = files_currentPath,
            t = id("files_input_file").files;
        if ("" != t.value && void 0 !== t[0].name) {
            var n = new FormData;
            n.append("path", e);
            for (var a = 0; a < t.length; a++) {
                var i = t[a],
                    o = e + i.name + "S";
                n.append(o, i.size), n.append("myfile[]", i, e + i.name)
            }
            files_error_status = "Upload " + i.name, id("files_currentUpload_msg").innerHTML = i.name, displayBlock("files_uploading_msg"), displayNone("files_navigation_buttons"), direct_sd && SendFileHttp("/upload", n, FilesUploadProgressDisplay, files_list_success, files_directSD_upload_failed), id("files_input_file").value = ""
        } else console.log("nothing to upload")
    }

    function FilesUploadProgressDisplay(e) { e.lengthComputable && (e = e.loaded / e.total * 100, id("files_prg").value = e, id("files_percent_upload").innerHTML = e.toFixed(0)) }
    var interval_status = -1,
        probe_progress_status = 0,
        grbl_error_msg = "",
        WCO = void 0,
        OVR = { feed: void 0, rapid: void 0, spindle: void 0 },
        MPOS = [0, 0, 0],
        WPOS = [0, 0, 0],
        grblaxis = 3,
        grblzerocmd = "X0 Y0 Z0",
        feedrate = [0, 0, 0, 0, 0, 0],
        last_axis_letter = "Z",
        axisNames = ["x", "y", "z", "a", "b", "c"],
        modal = { modes: "", plane: "G17", units: "G21", wcs: "G54", distance: "G90" };

    function setClickability(e, t) { setDisplay(e, t ? "table-row" : "none") }
    var autocheck = "report_auto";

    function getAutocheck() { return getChecked(autocheck) }

    function setAutocheck(e) { setChecked(autocheck, e) }

    function build_axis_selection() {
        for (var e, t = "<select class='form-control wauto' id='control_select_axis' onchange='control_changeaxis()' >", n = 3; n <= grblaxis; n++) 3 == n ? e = "Z" : 4 == n ? e = "A" : 5 == n ? e = "B" : 6 == n && (e = "C"), t += "<option value='" + e + "'", 3 == n && (t += " selected "), t += ">", t += e, t += "</option>\n";
        t += "</select>\n", 3 < grblaxis && (setHTML("axis_selection", t), setHTML("axis_label", translate_text_item("Axis") + ":"), setClickability("axis_selection", !0))
    }

    function control_changeaxis() {
        var e = getValue("control_select_axis");
        switch (setHTML("axisup", "+" + e), setHTML("axisdown", "-" + e), setHTML("homeZlabel", " " + e + " "), last_axis_letter) {
            case "Z":
                axis_feedrate[2] = getValue("control_z_velocity");
                break;
            case "A":
                axis_feedrate[3] = getValue("control_a_velocity");
                break;
            case "B":
                axis_feedrate[4] = getValue("control_b_velocity");
                break;
            case "C":
                axis_feedrate[5] = getValue("control_c_velocity")
        }
        switch (last_axis_letter = e) {
            case "Z":
                setValue("control_z_velocity", axis_feedrate[2]);
                break;
            case "A":
                setValue("control_a_velocity", axis_feedrate[3]);
                break;
            case "B":
                setValue("control_b_velocity", axis_feedrate[4]);
                break;
            case "C":
                setValue("control_c_velocity", axis_feedrate[5])
        }
    }

    function init_grbl_panel() { grbl_set_probe_detected(!1), tryAutoReport() }

    function grbl_clear_status() { grbl_set_probe_detected(!1), setHTML("grbl_status_text", grbl_error_msg = ""), setHTML("grbl_status", "") }

    function grbl_set_probe_detected(e) { setHTML("touch_status_icon", get_icon_svg(e ? "ok-circle" : "record", "1.3em", "1.3em", e ? "green" : "grey")) }

    function onprobemaxtravelChange() { var e = parseFloat(getValue("probemaxtravel")); return !(9999 < e || e <= 0 || isNaN(e) || null === e) || (alertdlg(translate_text_item("Out of range"), translate_text_item("Value of maximum probe travel must be between 1 mm and 9999 mm !")), !1) }

    function onprobefeedrateChange() { var e = parseInt(getValue("probefeedrate")); return !(e <= 0 || 9999 < e || isNaN(e) || null === e) || (alertdlg(translate_text_item("Out of range"), translate_text_item("Value of probe feedrate must be between 1 mm/min and 9999 mm/min !")), !1) }

    function onproberetractChange() { var e = parseFloat(getValue("proberetract")); return !(e < 0 || 999 < e || isNaN(e) || null === e) || (alertdlg(translate_text_item("Out of range"), translate_text_item("Value of probe retract must be between 0 mm and 9999 mm !")), !1) }

    function onprobetouchplatethicknessChange() { var e = parseFloat(getValue("probetouchplatethickness")); return !(e < 0 || 999 < e || isNaN(e) || null === e) || (alertdlg(translate_text_item("Out of range"), translate_text_item("Value of probe touch plate thickness must be between 0 mm and 9999 mm !")), !1) }
    var reportType = "none";

    function disablePolling() { setAutocheck(!1), -1 != interval_status && (clearInterval(interval_status), interval_status = -1), grbl_clear_status(), reportType = "none" }

    function enablePolling() { var e = parseFloat(getValue("statusInterval_check"));!isNaN(e) && 0 < e && e < 100 ? (-1 != interval_status && clearInterval(interval_status), interval_status = setInterval(function() { get_status() }, 1e3 * e), reportType = "polled", setChecked("report_poll", !0)) : (setValue("statusInterval_check", 0), alertdlg(translate_text_item("Out of range"), translate_text_item("Value of auto-check must be between 0s and 99s !!")), disablePolling()) }

    function tryAutoReport() { "polled" == reportType && disablePolling(), interval = id("autoReportInterval").value, setChecked("report_auto", !0), reportType = "auto", SendPrinterCommand("$Report/Interval=" + interval, !0, function() {}, function() { enablePolling() }, 99.1, 1) }

    function onAutoReportIntervalChange() { tryAutoReport() }

    function disableAutoReport() { SendPrinterCommand("$Report/Interval=0", !0, null, null, 99, 1), setChecked("report_auto", !1) }

    function reportNone() {
        switch (reportType) {
            case "polled":
                disablePolling();
                break;
            case "auto":
                disableAutoReport()
        }
        setChecked("report_none", !0), reportType = "none"
    }

    function reportPolled() { "auto" == reportType && disableAutoReport(), enablePolling() }

    function onReportType(e) {
        switch (e.value) {
            case "none":
                reportNone();
                break;
            case "auto":
                tryAutoReport();
                break;
            case "poll":
                reportPolled()
        }
    }

    function onstatusIntervalChange() { enablePolling() }

    function get_status() { SendPrinterCommand("?", !1, null, null, 114, 1) }

    function parseGrblStatus(e) {
        var o = { stateName: "", message: "", wco: void 0, mpos: void 0, wpos: void 0, feedrate: 0, spindle: void 0, spindleSpeed: void 0, ovr: void 0, lineNumber: void 0, flood: void 0, mist: void 0, pins: void 0 };
        return (e = e.replace("<", "").replace(">", "")).split("|").forEach(function(e) {
            var t = e.split(":"),
                n = t[0],
                a = t[1];
            switch (n) {
                case "Door":
                case "Hold":
                    o.stateName = n, o.message = e;
                    break;
                case "Run":
                case "Jog":
                case "Idle":
                case "Home":
                case "Alarm":
                case "Check":
                case "Sleep":
                    o.stateName = n;
                    break;
                case "Ln":
                    o.lineNumber = parseInt(a);
                    break;
                case "MPos":
                    o.mpos = a.split(",").map(function(e) { return parseFloat(e) });
                    break;
                case "WPos":
                    o.wpos = a.split(",").map(function(e) { return parseFloat(e) });
                    break;
                case "WCO":
                    o.wco = a.split(",").map(function(e) { return parseFloat(e) });
                    break;
                case "FS":
                    var i = a.split(",");
                    o.feedrate = parseFloat(i[0]), o.spindleSpeed = parseInt(i[1]);
                    break;
                case "Ov":
                    i = a.split(",");
                    o.ovr = { feed: parseInt(i[0]), rapid: parseInt(i[1]), spindle: parseInt(i[2]) };
                    break;
                case "A":
                    o.spindleDirection = "M5", Array.from(a).forEach(function(e) {
                        switch (e) {
                            case "S":
                                o.spindleDirection = "M3";
                                break;
                            case "C":
                                o.spindleDirection = "M4";
                                break;
                            case "F":
                                o.flood = !0;
                                break;
                            case "M":
                                o.mist = !0
                        }
                    });
                    break;
                case "SD":
                    i = a.split(",");
                    o.sdPercent = parseFloat(i[0]), o.sdName = i[1];
                    break;
                case "Pn":
                    o.pins = a
            }
        }), o
    }

    function clickableFromStateName(e, t) {
        var n = { resume: !1, pause: !1, reset: !1 };
        switch (e) {
            case "Run":
                n.pause = !0, n.reset = !0;
                break;
            case "Hold":
                n.resume = !0, n.reset = !0;
                break;
            case "Alarm":
                t && (n.resume = !0)
        }
        return n
    }

    function show_grbl_position(e, t) { e && e.forEach(function(e, t) { setHTML("control_" + axisNames[t] + "_position", e.toFixed(3)) }), t && t.forEach(function(e, t) { setHTML("control_" + axisNames[t] + "m_position", e.toFixed(3)) }) }

    function show_grbl_status(e, t, n) { e && (n = clickableFromStateName(e, n), setHTML("grbl_status", e), setClickability("sd_resume_btn", n.resume), setClickability("sd_pause_btn", n.pause), setClickability("sd_reset_btn", n.reset), "Hold" == e && 0 != probe_progress_status && probe_failed_notification()), setHTML("grbl_status_text", translate_text_item(t)), setClickability("clear_status_btn", "Alarm" == e) }

    function finalize_probing() { SendPrinterCommand("G90", !0, null, null, 90, 1), setClickability("probingbtn", !(probe_progress_status = 0)), setClickability("probingtext", !1), setClickability("sd_pause_btn", !1), setClickability("sd_resume_btn", !1), setClickability("sd_reset_btn", !1) }

    function show_grbl_SD(e, t) { setHTML("grbl_SD_status", e ? e + '&nbsp;<progress id="print_prg" value=' + t + ' max="100"></progress>' + t + "%" : "") }

    function show_grbl_probe_status(e) { grbl_set_probe_detected(e) }

    function SendRealtimeCmd(e) { SendPrinterCommand(String.fromCharCode(e), !1, null, null, e, 1) }

    function pauseGCode() { SendRealtimeCmd(33) }

    function resumeGCode() { SendRealtimeCmd(126) }

    function stopGCode() { grbl_reset() }

    function grblProcessStatus(e) {
        var t = parseGrblStatus(e);
        t.wco && (WCO = t.wco), t.ovr && (OVR = t.ovr), t.mpos ? (MPOS = t.mpos, WCO && (WPOS = t.mpos.map(function(e, t) { return e - WCO[t] }))) : t.wpos && (WPOS = t.wpos, WCO && (MPOS = t.wpos.map(function(e, t) { return e + WCO[t] }))), show_grbl_position(WPOS, MPOS), show_grbl_status(t.stateName, t.message, t.sdName), show_grbl_SD(t.sdName, t.sdPercent), show_grbl_probe_status(t.pins && -1 != t.pins.indexOf("P")), tabletGrblState(t, e)
    }

    function grbl_reset() { 0 != probe_progress_status && probe_failed_notification(), SendRealtimeCmd(24) }

    function grblGetProbeResult(e) {
        var t = e.split(":");
        2 < t.length && (e = t[2].replace("]", ""), 1 == parseInt(e.trim()) ? 0 != probe_progress_status && (e = "G53 G0 Z", t = t[1].split(","), SendPrinterCommand(e += parseFloat(t[2]), !0, null, null, 53, 1), SendPrinterCommand("G0 Z" + getValue("proberetract"), !0, null, null, 0, 1), finalize_probing()) : probe_failed_notification())
    }

    function probe_failed_notification() { finalize_probing(), alertdlg(translate_text_item("Error"), translate_text_item("Probe failed !")), beep(70, 261) }
    var modalModes = [{ name: "motion", values: ["G80", "G0", "G1", "G2", "G3", "G38.1", "G38.2", "G38.3", "G38.4"] }, { name: "wcs", values: ["G54", "G55", "G56", "G57", "G58", "G59"] }, { name: "plane", values: ["G17", "G18", "G19"] }, { name: "units", values: ["G20", "G21"] }, { name: "distance", values: ["G90", "G91"] }, { name: "arc_distance", values: ["G90.1", "G91.1"] }, { name: "feed", values: ["G93", "G94"] }, { name: "program", values: ["M0", "M1", "M2", "M30"] }, { name: "spindle", values: ["M3", "M4", "M5"] }, { name: "mist", values: ["M7"] }, { name: "flood", values: ["M8"] }, { name: "parking", values: ["M56"] }];

    function grblGetModal(e) {
        modal.modes = e.replace("[GC:", "").replace("]", "");
        e = modal.modes.split(" ");
        modal.parking = void 0, modal.program = "", e.forEach(function(n) { "M9" == n ? (modal.flood = n, modal.mist = n) : "T" === n.charAt(0) ? modal.tool = n.substring(1) : "F" === n.charAt(0) ? modal.feedrate = n.substring(1) : "S" === n.charAt(0) ? modal.spindle = n.substring(1) : modalModes.forEach(function(t) { t.values.forEach(function(e) { n == e && (modal[t.name] = n) }) }) }), tabletUpdateModal()
    }
    var collecting = !1,
        collectedData = "",
        collectHandler = void 0,
        collectedSettings = null,
        spindleSpeedSetTimeout;

    function grblHandleMessage(e) {
        if (tabletShowMessage(e, collecting), e.startsWith("<")) grblProcessStatus(e);
        else {
            if (e.startsWith("[GC:")) return grblGetModal(e), void console.log(e);
            if (collecting) e.startsWith("[MSG: EndData]") ? (collecting = !1, collectHandler && (collectHandler(collectedData), collectHandler = void 0), collectedData = "") : collectedData += e;
            else if (e.startsWith("[MSG: BeginData]")) collecting = !(collectedData = "");
            else if (collectedSettings) e.startsWith("ok") ? (getESPconfigSuccess(collectedSettings), collectedSettings = null, grbl_errorfn && (grbl_errorfn(), grbl_processfn = grbl_errorfn = null)) : collectedSettings += e;
            else if (e.startsWith("$0=") || e.startsWith("$10=")) collectedSettings = e;
            else if (e.startsWith("ok")) grbl_processfn && (grbl_processfn(), grbl_errorfn = grbl_processfn = null);
            else if (e.startsWith("[PRB:")) grblGetProbeResult(e);
            else if (!e.startsWith("[MSG:")) {
                if (e.startsWith("error:") && grbl_errorfn && (grbl_errorfn(), grbl_processfn = grbl_errorfn = null), e.startsWith("error:") || e.startsWith("ALARM:") || e.startsWith("Hold:") || e.startsWith("Door:")) return 0 != probe_progress_status && probe_failed_notification(), void(0 == grbl_error_msg.length && (grbl_error_msg = translate_text_item(e.trim())));
                e.startsWith("Grbl ") && console.log("Reset detected")
            }
        }
    }

    function StartProbeProcess() {
        var e, t = "G38.2 G91 Z-";
        onprobemaxtravelChange() && onprobefeedrateChange() && onproberetractChange() && onprobetouchplatethicknessChange() && (t += parseFloat(getValue("probemaxtravel")) + " F" + parseInt(getValue("probefeedrate")) + " P" + getValue("probetouchplatethickness"), console.log(t), e = !(probe_progress_status = 1), "none" == reportType && (tryAutoReport(), e = !0), SendPrinterCommand(t, !0, null, null, 38.2, 1), setClickability("probingbtn", !1), setClickability("probingtext", !0), setHTML("grbl_status_text", grbl_error_msg = ""), e && reportNone())
    }
    var spindleTabSpindleSpeed = 1;

    function setSpindleSpeed(e) { spindleSpeedSetTimeout && clearTimeout(spindleSpeedSetTimeout), 1 <= e && (spindleTabSpindleSpeed = e, spindleSpeedSetTimeout = setTimeout(() => SendPrinterCommand("S" + spindleTabSpindleSpeed, !1, null, null, 1, 1), 500)) }
    var http_communication_locked = !1,
        http_cmd_list = [],
        processing_cmd = !1,
        xmlhttpupload, max_cmd = 20;

    function clear_cmd_list() { processing_cmd = !(http_cmd_list = []) }

    function http_resultfn(e) { 0 < http_cmd_list.length && void 0 !== http_cmd_list[0].resultfn && (0, http_cmd_list[0].resultfn)(e), http_cmd_list.shift(), processing_cmd = !1, process_cmd() }

    function http_errorfn(e, t) {
        http_cmd_list[0].errorfn;
        0 < http_cmd_list.length && void 0 !== http_cmd_list[0].errorfn && null != http_cmd_list[0].errorfn && (401 == e && (logindlg(), console.log("Authentication issue pls log")), http_cmd_list[0].errorfn(e, t)), http_cmd_list.shift(), processing_cmd = !1, process_cmd()
    }

    function process_cmd() { 0 < http_cmd_list.length && !processing_cmd && ("GET" == http_cmd_list[0].type ? (processing_cmd = !0, ProcessGetHttp(http_cmd_list[0].cmd, http_resultfn, http_errorfn)) : "POST" == http_cmd_list[0].type ? (processing_cmd = !0, http_cmd_list[0].isupload ? ProcessFileHttp(http_cmd_list[0].cmd, http_cmd_list[0].data, http_cmd_list[0].progressfn, http_resultfn, http_errorfn) : ProcessPostHttp(http_cmd_list[0].cmd, http_cmd_list[0].data, http_resultfn, http_errorfn)) : "CMD" == http_cmd_list[0].type && (processing_cmd = !0, (0, http_cmd_list[0].cmd)(), http_cmd_list.shift(), processing_cmd = !1, process_cmd())) }

    function AddCmd(e, t) { http_cmd_list.length > max_cmd ? errorfn(999, translate_text_item("Server not responding")) : (http_cmd_list.push({ cmd: e, type: "CMD", id: e = void(e = 0) !== t ? t : e }), process_cmd()) }

    function SendGetHttp(e, t, n, a, i) {
        if (http_cmd_list.length > max_cmd && -1 != max_cmd) n(999, translate_text_item("Server not responding"));
        else {
            var o = 0,
                r = 1;
            if (void 0 !== a)
                for (o = a, void 0 !== i && (r = i), p = 0; p < http_cmd_list.length; p++)
                    if (http_cmd_list[p].id == o && r--, r <= 0) return void console.log("Limit reached for " + a);
            http_cmd_list.push({ cmd: e, type: "GET", isupload: !1, resultfn: t, errorfn: n, id: o }), process_cmd()
        }
    }

    function ProcessGetHttp(e, t, n) {
        if (http_communication_locked) return n(503, translate_text_item("Communication locked!")), void console.log("locked");
        var a = new XMLHttpRequest;
        a.onreadystatechange = function() { 4 == a.readyState && (200 == a.status ? void 0 !== t && null != t && t(a.responseText) : (401 == a.status && GetIdentificationStatus(), void 0 !== n && null != n && n(a.status, a.responseText))) }, e.startsWith("/command") && (e += -1 == e.indexOf("?") ? "?" : "&", e += "PAGEID=" + page_id), a.open("GET", e, !0), a.send()
    }

    function SendPostHttp(e, t, n, a, i, o) {
        if (http_cmd_list.length > max_cmd && -1 != max_cmd) a(999, translate_text_item("Server not responding"));
        else {
            var r = 0,
                s = 1;
            if (void 0 !== i)
                for (r = i, void 0 !== o && (s = o), p = 0; p < http_cmd_list.length; p++)
                    if (http_cmd_list[p].id == r && s--, s <= 0) return;
            a = { cmd: e, type: "POST", isupload: !1, data: t, resultfn: n, errorfn: a, initfn: init_fn, id: r };
            http_cmd_list.push(a), process_cmd()
        }
    }

    function ProcessPostHttp(e, t, n, a) {
        var i;
        http_communication_locked ? a(503, translate_text_item("Communication locked!")) : ((i = new XMLHttpRequest).onreadystatechange = function() { 4 == i.readyState && (200 == i.status ? void 0 !== n && null != n && n(i.responseText) : (401 == i.status && GetIdentificationStatus(), void 0 !== a && null != a && a(i.status, i.responseText))) }, e += -1 == e.indexOf("?") ? "?" : "&", e += "PAGEID=" + page_id, i.open("POST", e, !0), i.send(t))
    }

    function SendFileHttp(e, t, n, a, i) { http_cmd_list.length > max_cmd && -1 != max_cmd ? i(999, translate_text_item("Server not responding")) : (0 != http_cmd_list.length && (process = !1), http_cmd_list.push({ cmd: e, type: "POST", isupload: !0, data: t, progressfn: n, resultfn: a, errorfn: i, id: 0 }), process_cmd()) }

    function CancelCurrentUpload() { xmlhttpupload.abort(), console.log("Cancel Upload") }

    function ProcessFileHttp(e, t, n, a, i) { http_communication_locked ? i(503, translate_text_item("Communication locked!")) : (http_communication_locked = !0, (xmlhttpupload = new XMLHttpRequest).onreadystatechange = function() { 4 == xmlhttpupload.readyState && (http_communication_locked = !1, 200 == xmlhttpupload.status ? void 0 !== a && null != a && a(xmlhttpupload.responseText) : (401 == xmlhttpupload.status && GetIdentificationStatus(), void 0 !== i && null != i && i(xmlhttpupload.status, xmlhttpupload.responseText))) }, xmlhttpupload.open("POST", e, !0), void 0 !== n && null != n && xmlhttpupload.upload.addEventListener("progress", n, !1), xmlhttpupload.send(t)) }
    var list_icon = { hourglass: "M1000 1200v-150q0 -21 -14.5 -35.5t-35.5 -14.5h-50v-100q0 -91 -49.5 -165.5t-130.5 -109.5q81 -35 130.5 -109.5t49.5 -165.5v-150h50q21 0 35.5 -14.5t14.5 -35.5v-150h-800v150q0 21 14.5 35.5t35.5 14.5h50v150q0 91 49.5 165.5t130.5 109.5q-81 35 -130.5 109.5 t-49.5 165.5v100h-50q-21 0 -35.5 14.5t-14.5 35.5v150h800zM400 1000v-100q0 -60 32.5 -109.5t87.5 -73.5q28 -12 44 -37t16 -55t-16 -55t-44 -37q-55 -24 -87.5 -73.5t-32.5 -109.5v-150h400v150q0 60 -32.5 109.5t-87.5 73.5q-28 12 -44 37t-16 55t16 55t44 37 q55 24 87.5 73.5t32.5 109.5v100h-400z", cloud: "M503 1089q110 0 200.5 -59.5t134.5 -156.5q44 14 90 14q120 0 205 -86.5t85 -206.5q0 -121 -85 -207.5t-205 -86.5h-750q-79 0 -135.5 57t-56.5 137q0 69 42.5 122.5t108.5 67.5q-2 12 -2 37q0 153 108 260.5t260 107.5z", envelope: "M25 1100h1150q10 0 12.5 -5t-5.5 -13l-564 -567q-8 -8 -18 -8t-18 8l-564 567q-8 8 -5.5 13t12.5 5zM18 882l264 -264q8 -8 8 -18t-8 -18l-264 -264q-8 -8 -13 -5.5t-5 12.5v550q0 10 5 12.5t13 -5.5zM918 618l264 264q8 8 13 5.5t5 -12.5v-550q0 -10 -5 -12.5t-13 5.5 l-264 264q-8 8 -8 18t8 18zM818 482l364 -364q8 -8 5.5 -13t-12.5 -5h-1150q-10 0 -12.5 5t5.5 13l364 364q8 8 18 8t18 -8l164 -164q8 -8 18 -8t18 8l164 164q8 8 18 8t18 -8z", pencil: "M1011 1210q19 0 33 -13l153 -153q13 -14 13 -33t-13 -33l-99 -92l-214 214l95 96q13 14 32 14zM1013 800l-615 -614l-214 214l614 614zM317 96l-333 -112l110 335z", music: "M368 1017l645 163q39 15 63 0t24 -49v-831q0 -55 -41.5 -95.5t-111.5 -63.5q-79 -25 -147 -4.5t-86 75t25.5 111.5t122.5 82q72 24 138 8v521l-600 -155v-606q0 -42 -44 -90t-109 -69q-79 -26 -147 -5.5t-86 75.5t25.5 111.5t122.5 82.5q72 24 138 7v639q0 38 14.5 59 t53.5 34z", search: "M500 1191q100 0 191 -39t156.5 -104.5t104.5 -156.5t39 -191l-1 -2l1 -5q0 -141 -78 -262l275 -274q23 -26 22.5 -44.5t-22.5 -42.5l-59 -58q-26 -20 -46.5 -20t-39.5 20l-275 274q-119 -77 -261 -77l-5 1l-2 -1q-100 0 -191 39t-156.5 104.5t-104.5 156.5t-39 191 t39 191t104.5 156.5t156.5 104.5t191 39zM500 1022q-88 0 -162 -43t-117 -117t-43 -162t43 -162t117 -117t162 -43t162 43t117 117t43 162t-43 162t-117 117t-162 43z", heart: "M649 949q48 68 109.5 104t121.5 38.5t118.5 -20t102.5 -64t71 -100.5t27 -123q0 -57 -33.5 -117.5t-94 -124.5t-126.5 -127.5t-150 -152.5t-146 -174q-62 85 -145.5 174t-150 152.5t-126.5 127.5t-93.5 124.5t-33.5 117.5q0 64 28 123t73 100.5t104 64t119 20 t120.5 -38.5t104.5 -104z", star: "M407 800l131 353q7 19 17.5 19t17.5 -19l129 -353h421q21 0 24 -8.5t-14 -20.5l-342 -249l130 -401q7 -20 -0.5 -25.5t-24.5 6.5l-343 246l-342 -247q-17 -12 -24.5 -6.5t-0.5 25.5l130 400l-347 251q-17 12 -14 20.5t23 8.5h429z", "star-empty": "M407 800l131 353q7 19 17.5 19t17.5 -19l129 -353h421q21 0 24 -8.5t-14 -20.5l-342 -249l130 -401q7 -20 -0.5 -25.5t-24.5 6.5l-343 246l-342 -247q-17 -12 -24.5 -6.5t-0.5 25.5l130 400l-347 251q-17 12 -14 20.5t23 8.5h429zM477 700h-240l197 -142l-74 -226 l193 139l195 -140l-74 229l192 140h-234l-78 211z", user: "M600 1200q124 0 212 -88t88 -212v-250q0 -46 -31 -98t-69 -52v-75q0 -10 6 -21.5t15 -17.5l358 -230q9 -5 15 -16.5t6 -21.5v-93q0 -10 -7.5 -17.5t-17.5 -7.5h-1150q-10 0 -17.5 7.5t-7.5 17.5v93q0 10 6 21.5t15 16.5l358 230q9 6 15 17.5t6 21.5v75q-38 0 -69 52 t-31 98v250q0 124 88 212t212 88z", "th-large": "M50 1100h400q21 0 35.5 -14.5t14.5 -35.5v-400q0 -21 -14.5 -35.5t-35.5 -14.5h-400q-21 0 -35.5 14.5t-14.5 35.5v400q0 21 14.5 35.5t35.5 14.5zM650 1100h400q21 0 35.5 -14.5t14.5 -35.5v-400q0 -21 -14.5 -35.5t-35.5 -14.5h-400q-21 0 -35.5 14.5t-14.5 35.5v400 q0 21 14.5 35.5t35.5 14.5zM50 500h400q21 0 35.5 -14.5t14.5 -35.5v-400q0 -21 -14.5 -35.5t-35.5 -14.5h-400q-21 0 -35.5 14.5t-14.5 35.5v400q0 21 14.5 35.5t35.5 14.5zM650 500h400q21 0 35.5 -14.5t14.5 -35.5v-400q0 -21 -14.5 -35.5t-35.5 -14.5h-400 q-21 0 -35.5 14.5t-14.5 35.5v400q0 21 14.5 35.5t35.5 14.5z", th: "M50 1100h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM450 1100h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200 q0 21 14.5 35.5t35.5 14.5zM850 1100h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM50 700h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200 q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM450 700h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM850 700h200q21 0 35.5 -14.5t14.5 -35.5v-200 q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM50 300h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM450 300h200 q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM850 300h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5 t35.5 14.5z", "th-list": "M50 1100h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM450 1100h700q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-700q-21 0 -35.5 14.5t-14.5 35.5v200 q0 21 14.5 35.5t35.5 14.5zM50 700h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM450 700h700q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-700 q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM50 300h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5zM450 300h700q21 0 35.5 -14.5t14.5 -35.5v-200 q0 -21 -14.5 -35.5t-35.5 -14.5h-700q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5z", ok: "M465 477l571 571q8 8 18 8t17 -8l177 -177q8 -7 8 -17t-8 -18l-783 -784q-7 -8 -17.5 -8t-17.5 8l-384 384q-8 8 -8 18t8 17l177 177q7 8 17 8t18 -8l171 -171q7 -7 18 -7t18 7z", remove: "M904 1083l178 -179q8 -8 8 -18.5t-8 -17.5l-267 -268l267 -268q8 -7 8 -17.5t-8 -18.5l-178 -178q-8 -8 -18.5 -8t-17.5 8l-268 267l-268 -267q-7 -8 -17.5 -8t-18.5 8l-178 178q-8 8 -8 18.5t8 17.5l267 268l-267 268q-8 7 -8 17.5t8 18.5l178 178q8 8 18.5 8t17.5 -8 l268 -267l268 268q7 7 17.5 7t18.5 -7z", "zoom-in": "M507 1177q98 0 187.5 -38.5t154.5 -103.5t103.5 -154.5t38.5 -187.5q0 -141 -78 -262l300 -299q8 -8 8 -18.5t-8 -18.5l-109 -108q-7 -8 -17.5 -8t-18.5 8l-300 299q-119 -77 -261 -77q-98 0 -188 38.5t-154.5 103t-103 154.5t-38.5 188t38.5 187.5t103 154.5 t154.5 103.5t188 38.5zM506.5 1023q-89.5 0 -165.5 -44t-120 -120.5t-44 -166t44 -165.5t120 -120t165.5 -44t166 44t120.5 120t44 165.5t-44 166t-120.5 120.5t-166 44zM425 900h150q10 0 17.5 -7.5t7.5 -17.5v-75h75q10 0 17.5 -7.5t7.5 -17.5v-150q0 -10 -7.5 -17.5 t-17.5 -7.5h-75v-75q0 -10 -7.5 -17.5t-17.5 -7.5h-150q-10 0 -17.5 7.5t-7.5 17.5v75h-75q-10 0 -17.5 7.5t-7.5 17.5v150q0 10 7.5 17.5t17.5 7.5h75v75q0 10 7.5 17.5t17.5 7.5z", "zoom-out": "M507 1177q98 0 187.5 -38.5t154.5 -103.5t103.5 -154.5t38.5 -187.5q0 -141 -78 -262l300 -299q8 -8 8 -18.5t-8 -18.5l-109 -108q-7 -8 -17.5 -8t-18.5 8l-300 299q-119 -77 -261 -77q-98 0 -188 38.5t-154.5 103t-103 154.5t-38.5 188t38.5 187.5t103 154.5 t154.5 103.5t188 38.5zM506.5 1023q-89.5 0 -165.5 -44t-120 -120.5t-44 -166t44 -165.5t120 -120t165.5 -44t166 44t120.5 120t44 165.5t-44 166t-120.5 120.5t-166 44zM325 800h350q10 0 17.5 -7.5t7.5 -17.5v-150q0 -10 -7.5 -17.5t-17.5 -7.5h-350q-10 0 -17.5 7.5 t-7.5 17.5v150q0 10 7.5 17.5t17.5 7.5z", off: "M550 1200h100q21 0 35.5 -14.5t14.5 -35.5v-400q0 -21 -14.5 -35.5t-35.5 -14.5h-100q-21 0 -35.5 14.5t-14.5 35.5v400q0 21 14.5 35.5t35.5 14.5zM800 975v166q167 -62 272 -209.5t105 -331.5q0 -117 -45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5 t-184.5 123t-123 184.5t-45.5 224q0 184 105 331.5t272 209.5v-166q-103 -55 -165 -155t-62 -220q0 -116 57 -214.5t155.5 -155.5t214.5 -57t214.5 57t155.5 155.5t57 214.5q0 120 -62 220t-165 155z", signal: "M1025 1200h150q10 0 17.5 -7.5t7.5 -17.5v-1150q0 -10 -7.5 -17.5t-17.5 -7.5h-150q-10 0 -17.5 7.5t-7.5 17.5v1150q0 10 7.5 17.5t17.5 7.5zM725 800h150q10 0 17.5 -7.5t7.5 -17.5v-750q0 -10 -7.5 -17.5t-17.5 -7.5h-150q-10 0 -17.5 7.5t-7.5 17.5v750 q0 10 7.5 17.5t17.5 7.5zM425 500h150q10 0 17.5 -7.5t7.5 -17.5v-450q0 -10 -7.5 -17.5t-17.5 -7.5h-150q-10 0 -17.5 7.5t-7.5 17.5v450q0 10 7.5 17.5t17.5 7.5zM125 300h150q10 0 17.5 -7.5t7.5 -17.5v-250q0 -10 -7.5 -17.5t-17.5 -7.5h-150q-10 0 -17.5 7.5t-7.5 17.5 v250q0 10 7.5 17.5t17.5 7.5z", cog: "M600 1174q33 0 74 -5l38 -152l5 -1q49 -14 94 -39l5 -2l134 80q61 -48 104 -105l-80 -134l3 -5q25 -44 39 -93l1 -6l152 -38q5 -43 5 -73q0 -34 -5 -74l-152 -38l-1 -6q-15 -49 -39 -93l-3 -5l80 -134q-48 -61 -104 -105l-134 81l-5 -3q-44 -25 -94 -39l-5 -2l-38 -151 q-43 -5 -74 -5q-33 0 -74 5l-38 151l-5 2q-49 14 -94 39l-5 3l-134 -81q-60 48 -104 105l80 134l-3 5q-25 45 -38 93l-2 6l-151 38q-6 42 -6 74q0 33 6 73l151 38l2 6q13 48 38 93l3 5l-80 134q47 61 105 105l133 -80l5 2q45 25 94 39l5 1l38 152q43 5 74 5zM600 815 q-89 0 -152 -63t-63 -151.5t63 -151.5t152 -63t152 63t63 151.5t-63 151.5t-152 63z", trash: "M500 1300h300q41 0 70.5 -29.5t29.5 -70.5v-100h275q10 0 17.5 -7.5t7.5 -17.5v-75h-1100v75q0 10 7.5 17.5t17.5 7.5h275v100q0 41 29.5 70.5t70.5 29.5zM500 1200v-100h300v100h-300zM1100 900v-800q0 -41 -29.5 -70.5t-70.5 -29.5h-700q-41 0 -70.5 29.5t-29.5 70.5 v800h900zM300 800v-700h100v700h-100zM500 800v-700h100v700h-100zM700 800v-700h100v700h-100zM900 800v-700h100v700h-100z", home: "M18 618l620 608q8 7 18.5 7t17.5 -7l608 -608q8 -8 5.5 -13t-12.5 -5h-175v-575q0 -10 -7.5 -17.5t-17.5 -7.5h-250q-10 0 -17.5 7.5t-7.5 17.5v375h-300v-375q0 -10 -7.5 -17.5t-17.5 -7.5h-250q-10 0 -17.5 7.5t-7.5 17.5v575h-175q-10 0 -12.5 5t5.5 13z", file: "M600 1200v-400q0 -41 29.5 -70.5t70.5 -29.5h300v-650q0 -21 -14.5 -35.5t-35.5 -14.5h-800q-21 0 -35.5 14.5t-14.5 35.5v1100q0 21 14.5 35.5t35.5 14.5h450zM1000 800h-250q-21 0 -35.5 14.5t-14.5 35.5v250z", time: "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM600 1027q-116 0 -214.5 -57t-155.5 -155.5t-57 -214.5t57 -214.5 t155.5 -155.5t214.5 -57t214.5 57t155.5 155.5t57 214.5t-57 214.5t-155.5 155.5t-214.5 57zM525 900h50q10 0 17.5 -7.5t7.5 -17.5v-275h175q10 0 17.5 -7.5t7.5 -17.5v-50q0 -10 -7.5 -17.5t-17.5 -7.5h-250q-10 0 -17.5 7.5t-7.5 17.5v350q0 10 7.5 17.5t17.5 7.5z", "download-alt": "M550 1200h200q21 0 35.5 -14.5t14.5 -35.5v-450h191q20 0 25.5 -11.5t-7.5 -27.5l-327 -400q-13 -16 -32 -16t-32 16l-327 400q-13 16 -7.5 27.5t25.5 11.5h191v450q0 21 14.5 35.5t35.5 14.5zM1125 400h50q10 0 17.5 -7.5t7.5 -17.5v-350q0 -10 -7.5 -17.5t-17.5 -7.5 h-1050q-10 0 -17.5 7.5t-7.5 17.5v350q0 10 7.5 17.5t17.5 7.5h50q10 0 17.5 -7.5t7.5 -17.5v-175h900v175q0 10 7.5 17.5t17.5 7.5z", download: "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM600 1027q-116 0 -214.5 -57t-155.5 -155.5t-57 -214.5t57 -214.5 t155.5 -155.5t214.5 -57t214.5 57t155.5 155.5t57 214.5t-57 214.5t-155.5 155.5t-214.5 57zM525 900h150q10 0 17.5 -7.5t7.5 -17.5v-275h137q21 0 26 -11.5t-8 -27.5l-223 -275q-13 -16 -32 -16t-32 16l-223 275q-13 16 -8 27.5t26 11.5h137v275q0 10 7.5 17.5t17.5 7.5z ", upload: "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM600 1027q-116 0 -214.5 -57t-155.5 -155.5t-57 -214.5t57 -214.5 t155.5 -155.5t214.5 -57t214.5 57t155.5 155.5t57 214.5t-57 214.5t-155.5 155.5t-214.5 57zM632 914l223 -275q13 -16 8 -27.5t-26 -11.5h-137v-275q0 -10 -7.5 -17.5t-17.5 -7.5h-150q-10 0 -17.5 7.5t-7.5 17.5v275h-137q-21 0 -26 11.5t8 27.5l223 275q13 16 32 16 t32 -16z", inbox: "M225 1200h750q10 0 19.5 -7t12.5 -17l186 -652q7 -24 7 -49v-425q0 -12 -4 -27t-9 -17q-12 -6 -37 -6h-1100q-12 0 -27 4t-17 8q-6 13 -6 38l1 425q0 25 7 49l185 652q3 10 12.5 17t19.5 7zM878 1000h-556q-10 0 -19 -7t-11 -18l-87 -450q-2 -11 4 -18t16 -7h150 q10 0 19.5 -7t11.5 -17l38 -152q2 -10 11.5 -17t19.5 -7h250q10 0 19.5 7t11.5 17l38 152q2 10 11.5 17t19.5 7h150q10 0 16 7t4 18l-87 450q-2 11 -11 18t-19 7z", "play-circle": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM600 1027q-116 0 -214.5 -57t-155.5 -155.5t-57 -214.5t57 -214.5 t155.5 -155.5t214.5 -57t214.5 57t155.5 155.5t57 214.5t-57 214.5t-155.5 155.5t-214.5 57zM540 820l253 -190q17 -12 17 -30t-17 -30l-253 -190q-16 -12 -28 -6.5t-12 26.5v400q0 21 12 26.5t28 -6.5z", repeat: "M947 1060l135 135q7 7 12.5 5t5.5 -13v-362q0 -10 -7.5 -17.5t-17.5 -7.5h-362q-11 0 -13 5.5t5 12.5l133 133q-109 76 -238 76q-116 0 -214.5 -57t-155.5 -155.5t-57 -214.5t57 -214.5t155.5 -155.5t214.5 -57t214.5 57t155.5 155.5t57 214.5h150q0 -117 -45.5 -224 t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5q192 0 347 -117z", refresh: "M947 1060l135 135q7 7 12.5 5t5.5 -13v-361q0 -11 -7.5 -18.5t-18.5 -7.5h-361q-11 0 -13 5.5t5 12.5l134 134q-110 75 -239 75q-116 0 -214.5 -57t-155.5 -155.5t-57 -214.5h-150q0 117 45.5 224t123 184.5t184.5 123t224 45.5q192 0 347 -117zM1027 600h150 q0 -117 -45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5q-192 0 -348 118l-134 -134q-7 -8 -12.5 -5.5t-5.5 12.5v360q0 11 7.5 18.5t18.5 7.5h360q10 0 12.5 -5.5t-5.5 -12.5l-133 -133q110 -76 240 -76q116 0 214.5 57t155.5 155.5t57 214.5z", "list-alt": "M125 1200h1050q10 0 17.5 -7.5t7.5 -17.5v-1150q0 -10 -7.5 -17.5t-17.5 -7.5h-1050q-10 0 -17.5 7.5t-7.5 17.5v1150q0 10 7.5 17.5t17.5 7.5zM1075 1000h-850q-10 0 -17.5 -7.5t-7.5 -17.5v-850q0 -10 7.5 -17.5t17.5 -7.5h850q10 0 17.5 7.5t7.5 17.5v850 q0 10 -7.5 17.5t-17.5 7.5zM325 900h50q10 0 17.5 -7.5t7.5 -17.5v-50q0 -10 -7.5 -17.5t-17.5 -7.5h-50q-10 0 -17.5 7.5t-7.5 17.5v50q0 10 7.5 17.5t17.5 7.5zM525 900h450q10 0 17.5 -7.5t7.5 -17.5v-50q0 -10 -7.5 -17.5t-17.5 -7.5h-450q-10 0 -17.5 7.5t-7.5 17.5v50 q0 10 7.5 17.5t17.5 7.5zM325 700h50q10 0 17.5 -7.5t7.5 -17.5v-50q0 -10 -7.5 -17.5t-17.5 -7.5h-50q-10 0 -17.5 7.5t-7.5 17.5v50q0 10 7.5 17.5t17.5 7.5zM525 700h450q10 0 17.5 -7.5t7.5 -17.5v-50q0 -10 -7.5 -17.5t-17.5 -7.5h-450q-10 0 -17.5 7.5t-7.5 17.5v50 q0 10 7.5 17.5t17.5 7.5zM325 500h50q10 0 17.5 -7.5t7.5 -17.5v-50q0 -10 -7.5 -17.5t-17.5 -7.5h-50q-10 0 -17.5 7.5t-7.5 17.5v50q0 10 7.5 17.5t17.5 7.5zM525 500h450q10 0 17.5 -7.5t7.5 -17.5v-50q0 -10 -7.5 -17.5t-17.5 -7.5h-450q-10 0 -17.5 7.5t-7.5 17.5v50 q0 10 7.5 17.5t17.5 7.5zM325 300h50q10 0 17.5 -7.5t7.5 -17.5v-50q0 -10 -7.5 -17.5t-17.5 -7.5h-50q-10 0 -17.5 7.5t-7.5 17.5v50q0 10 7.5 17.5t17.5 7.5zM525 300h450q10 0 17.5 -7.5t7.5 -17.5v-50q0 -10 -7.5 -17.5t-17.5 -7.5h-450q-10 0 -17.5 7.5t-7.5 17.5v50 q0 10 7.5 17.5t17.5 7.5z", lock: "M900 800v200q0 83 -58.5 141.5t-141.5 58.5h-300q-82 0 -141 -59t-59 -141v-200h-100q-41 0 -70.5 -29.5t-29.5 -70.5v-600q0 -41 29.5 -70.5t70.5 -29.5h900q41 0 70.5 29.5t29.5 70.5v600q0 41 -29.5 70.5t-70.5 29.5h-100zM400 800v150q0 21 15 35.5t35 14.5h200 q20 0 35 -14.5t15 -35.5v-150h-300z", flag: "M125 1100h50q10 0 17.5 -7.5t7.5 -17.5v-1075h-100v1075q0 10 7.5 17.5t17.5 7.5zM1075 1052q4 0 9 -2q16 -6 16 -23v-421q0 -6 -3 -12q-33 -59 -66.5 -99t-65.5 -58t-56.5 -24.5t-52.5 -6.5q-26 0 -57.5 6.5t-52.5 13.5t-60 21q-41 15 -63 22.5t-57.5 15t-65.5 7.5 q-85 0 -160 -57q-7 -5 -15 -5q-6 0 -11 3q-14 7 -14 22v438q22 55 82 98.5t119 46.5q23 2 43 0.5t43 -7t32.5 -8.5t38 -13t32.5 -11q41 -14 63.5 -21t57 -14t63.5 -7q103 0 183 87q7 8 18 8z", "volume-off": "M321 814l258 172q9 6 15 2.5t6 -13.5v-750q0 -10 -6 -13.5t-15 2.5l-258 172q-21 14 -46 14h-250q-10 0 -17.5 7.5t-7.5 17.5v350q0 10 7.5 17.5t17.5 7.5h250q25 0 46 14zM900 668l120 120q7 7 17 7t17 -7l34 -34q7 -7 7 -17t-7 -17l-120 -120l120 -120q7 -7 7 -17 t-7 -17l-34 -34q-7 -7 -17 -7t-17 7l-120 119l-120 -119q-7 -7 -17 -7t-17 7l-34 34q-7 7 -7 17t7 17l119 120l-119 120q-7 7 -7 17t7 17l34 34q7 8 17 8t17 -8z", "volume-down": "M321 814l258 172q9 6 15 2.5t6 -13.5v-750q0 -10 -6 -13.5t-15 2.5l-258 172q-21 14 -46 14h-250q-10 0 -17.5 7.5t-7.5 17.5v350q0 10 7.5 17.5t17.5 7.5h250q25 0 46 14zM766 900h4q10 -1 16 -10q96 -129 96 -290q0 -154 -90 -281q-6 -9 -17 -10l-3 -1q-9 0 -16 6 l-29 23q-7 7 -8.5 16.5t4.5 17.5q72 103 72 229q0 132 -78 238q-6 8 -4.5 18t9.5 17l29 22q7 5 15 5z", "volume-up": "M967 1004h3q11 -1 17 -10q135 -179 135 -396q0 -105 -34 -206.5t-98 -185.5q-7 -9 -17 -10h-3q-9 0 -16 6l-42 34q-8 6 -9 16t5 18q111 150 111 328q0 90 -29.5 176t-84.5 157q-6 9 -5 19t10 16l42 33q7 5 15 5zM321 814l258 172q9 6 15 2.5t6 -13.5v-750q0 -10 -6 -13.5 t-15 2.5l-258 172q-21 14 -46 14h-250q-10 0 -17.5 7.5t-7.5 17.5v350q0 10 7.5 17.5t17.5 7.5h250q25 0 46 14zM766 900h4q10 -1 16 -10q96 -129 96 -290q0 -154 -90 -281q-6 -9 -17 -10l-3 -1q-9 0 -16 6l-29 23q-7 7 -8.5 16.5t4.5 17.5q72 103 72 229q0 132 -78 238 q-6 8 -4.5 18.5t9.5 16.5l29 22q7 5 15 5z", tag: "M500 1200l682 -682q8 -8 8 -18t-8 -18l-464 -464q-8 -8 -18 -8t-18 8l-682 682l1 475q0 10 7.5 17.5t17.5 7.5h474zM319.5 1024.5q-29.5 29.5 -71 29.5t-71 -29.5t-29.5 -71.5t29.5 -71.5t71 -29.5t71 29.5t29.5 71.5t-29.5 71.5z", print: "M822 1200h-444q-11 0 -19 -7.5t-9 -17.5l-78 -301q-7 -24 7 -45l57 -108q6 -9 17.5 -15t21.5 -6h450q10 0 21.5 6t17.5 15l62 108q14 21 7 45l-83 301q-1 10 -9 17.5t-19 7.5zM1175 800h-150q-10 0 -21 -6.5t-15 -15.5l-78 -156q-4 -9 -15 -15.5t-21 -6.5h-550 q-10 0 -21 6.5t-15 15.5l-78 156q-4 9 -15 15.5t-21 6.5h-150q-10 0 -17.5 -7.5t-7.5 -17.5v-650q0 -10 7.5 -17.5t17.5 -7.5h150q10 0 17.5 7.5t7.5 17.5v150q0 10 7.5 17.5t17.5 7.5h750q10 0 17.5 -7.5t7.5 -17.5v-150q0 -10 7.5 -17.5t17.5 -7.5h150q10 0 17.5 7.5 t7.5 17.5v650q0 10 -7.5 17.5t-17.5 7.5zM850 200h-500q-10 0 -19.5 -7t-11.5 -17l-38 -152q-2 -10 3.5 -17t15.5 -7h600q10 0 15.5 7t3.5 17l-38 152q-2 10 -11.5 17t-19.5 7z", camera: "M500 1100h200q56 0 102.5 -20.5t72.5 -50t44 -59t25 -50.5l6 -20h150q41 0 70.5 -29.5t29.5 -70.5v-600q0 -41 -29.5 -70.5t-70.5 -29.5h-1000q-41 0 -70.5 29.5t-29.5 70.5v600q0 41 29.5 70.5t70.5 29.5h150q2 8 6.5 21.5t24 48t45 61t72 48t102.5 21.5zM900 800v-100 h100v100h-100zM600 730q-95 0 -162.5 -67.5t-67.5 -162.5t67.5 -162.5t162.5 -67.5t162.5 67.5t67.5 162.5t-67.5 162.5t-162.5 67.5zM600 603q43 0 73 -30t30 -73t-30 -73t-73 -30t-73 30t-30 73t30 73t73 30z", "align-justify": "M50 1100h1100q21 0 35.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-35.5 -14.5h-1100q-21 0 -35.5 14.5t-14.5 35.5v100q0 21 14.5 35.5t35.5 14.5zM50 800h1100q21 0 35.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-35.5 -14.5h-1100q-21 0 -35.5 14.5t-14.5 35.5v100 q0 21 14.5 35.5t35.5 14.5zM50 500h1100q21 0 35.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-35.5 -14.5h-1100q-21 0 -35.5 14.5t-14.5 35.5v100q0 21 14.5 35.5t35.5 14.5zM50 200h1100q21 0 35.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-35.5 -14.5h-1100 q-21 0 -35.5 14.5t-14.5 35.5v100q0 21 14.5 35.5t35.5 14.5z", "facetime-video": "M75 1000h750q31 0 53 -22t22 -53v-650q0 -31 -22 -53t-53 -22h-750q-31 0 -53 22t-22 53v650q0 31 22 53t53 22zM1200 300l-300 300l300 300v-600z", picture: "M44 1100h1112q18 0 31 -13t13 -31v-1012q0 -18 -13 -31t-31 -13h-1112q-18 0 -31 13t-13 31v1012q0 18 13 31t31 13zM100 1000v-737l247 182l298 -131l-74 156l293 318l236 -288v500h-1000zM342 884q56 0 95 -39t39 -94.5t-39 -95t-95 -39.5t-95 39.5t-39 95t39 94.5 t95 39z", "map-maker": "M648 1169q117 0 216 -60t156.5 -161t57.5 -218q0 -115 -70 -258q-69 -109 -158 -225.5t-143 -179.5l-54 -62q-9 8 -25.5 24.5t-63.5 67.5t-91 103t-98.5 128t-95.5 148q-60 132 -60 249q0 88 34 169.5t91.5 142t137 96.5t166.5 36zM652.5 974q-91.5 0 -156.5 -65 t-65 -157t65 -156.5t156.5 -64.5t156.5 64.5t65 156.5t-65 157t-156.5 65z", adjust: "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM600 173v854q-116 0 -214.5 -57t-155.5 -155.5t-57 -214.5t57 -214.5 t155.5 -155.5t214.5 -57z", tint: "M554 1295q21 -72 57.5 -143.5t76 -130t83 -118t82.5 -117t70 -116t49.5 -126t18.5 -136.5q0 -71 -25.5 -135t-68.5 -111t-99 -82t-118.5 -54t-125.5 -23q-84 5 -161.5 34t-139.5 78.5t-99 125t-37 164.5q0 69 18 136.5t49.5 126.5t69.5 116.5t81.5 117.5t83.5 119 t76.5 131t58.5 143zM344 710q-23 -33 -43.5 -70.5t-40.5 -102.5t-17 -123q1 -37 14.5 -69.5t30 -52t41 -37t38.5 -24.5t33 -15q21 -7 32 -1t13 22l6 34q2 10 -2.5 22t-13.5 19q-5 4 -14 12t-29.5 40.5t-32.5 73.5q-26 89 6 271q2 11 -6 11q-8 1 -15 -10z", edit: "M1000 1013l108 115q2 1 5 2t13 2t20.5 -1t25 -9.5t28.5 -21.5q22 -22 27 -43t0 -32l-6 -10l-108 -115zM350 1100h400q50 0 105 -13l-187 -187h-368q-41 0 -70.5 -29.5t-29.5 -70.5v-500q0 -41 29.5 -70.5t70.5 -29.5h500q41 0 70.5 29.5t29.5 70.5v182l200 200v-332 q0 -165 -93.5 -257.5t-256.5 -92.5h-400q-165 0 -257.5 92.5t-92.5 257.5v400q0 165 92.5 257.5t257.5 92.5zM1009 803l-362 -362l-161 -50l55 170l355 355z", share: "M350 1100h361q-164 -146 -216 -200h-195q-41 0 -70.5 -29.5t-29.5 -70.5v-500q0 -41 29.5 -70.5t70.5 -29.5h500q41 0 70.5 29.5t29.5 70.5l200 153v-103q0 -165 -92.5 -257.5t-257.5 -92.5h-400q-165 0 -257.5 92.5t-92.5 257.5v400q0 165 92.5 257.5t257.5 92.5z M824 1073l339 -301q8 -7 8 -17.5t-8 -17.5l-340 -306q-7 -6 -12.5 -4t-6.5 11v203q-26 1 -54.5 0t-78.5 -7.5t-92 -17.5t-86 -35t-70 -57q10 59 33 108t51.5 81.5t65 58.5t68.5 40.5t67 24.5t56 13.5t40 4.5v210q1 10 6.5 12.5t13.5 -4.5z", check: "M350 1100h350q60 0 127 -23l-178 -177h-349q-41 0 -70.5 -29.5t-29.5 -70.5v-500q0 -41 29.5 -70.5t70.5 -29.5h500q41 0 70.5 29.5t29.5 70.5v69l200 200v-219q0 -165 -92.5 -257.5t-257.5 -92.5h-400q-165 0 -257.5 92.5t-92.5 257.5v400q0 165 92.5 257.5t257.5 92.5z M643 639l395 395q7 7 17.5 7t17.5 -7l101 -101q7 -7 7 -17.5t-7 -17.5l-531 -532q-7 -7 -17.5 -7t-17.5 7l-248 248q-7 7 -7 17.5t7 17.5l101 101q7 7 17.5 7t17.5 -7l111 -111q8 -7 18 -7t18 7z", move: "M318 918l264 264q8 8 18 8t18 -8l260 -264q7 -8 4.5 -13t-12.5 -5h-170v-200h200v173q0 10 5 12t13 -5l264 -260q8 -7 8 -17.5t-8 -17.5l-264 -265q-8 -7 -13 -5t-5 12v173h-200v-200h170q10 0 12.5 -5t-4.5 -13l-260 -264q-8 -8 -18 -8t-18 8l-264 264q-8 8 -5.5 13 t12.5 5h175v200h-200v-173q0 -10 -5 -12t-13 5l-264 265q-8 7 -8 17.5t8 17.5l264 260q8 7 13 5t5 -12v-173h200v200h-175q-10 0 -12.5 5t5.5 13z", "step-backward": "M250 1100h100q21 0 35.5 -14.5t14.5 -35.5v-438l464 453q15 14 25.5 10t10.5 -25v-1000q0 -21 -10.5 -25t-25.5 10l-464 453v-438q0 -21 -14.5 -35.5t-35.5 -14.5h-100q-21 0 -35.5 14.5t-14.5 35.5v1000q0 21 14.5 35.5t35.5 14.5z", "fast-backward": "M50 1100h100q21 0 35.5 -14.5t14.5 -35.5v-438l464 453q15 14 25.5 10t10.5 -25v-438l464 453q15 14 25.5 10t10.5 -25v-1000q0 -21 -10.5 -25t-25.5 10l-464 453v-438q0 -21 -10.5 -25t-25.5 10l-464 453v-438q0 -21 -14.5 -35.5t-35.5 -14.5h-100q-21 0 -35.5 14.5 t-14.5 35.5v1000q0 21 14.5 35.5t35.5 14.5z", backward: "M1200 1050v-1000q0 -21 -10.5 -25t-25.5 10l-464 453v-438q0 -21 -10.5 -25t-25.5 10l-492 480q-15 14 -15 35t15 35l492 480q15 14 25.5 10t10.5 -25v-438l464 453q15 14 25.5 10t10.5 -25z", play: "M243 1074l814 -498q18 -11 18 -26t-18 -26l-814 -498q-18 -11 -30.5 -4t-12.5 28v1000q0 21 12.5 28t30.5 -4z", pause: "M250 1000h200q21 0 35.5 -14.5t14.5 -35.5v-800q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v800q0 21 14.5 35.5t35.5 14.5zM650 1000h200q21 0 35.5 -14.5t14.5 -35.5v-800q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v800 q0 21 14.5 35.5t35.5 14.5z", stop: "M1100 950v-800q0 -21 -14.5 -35.5t-35.5 -14.5h-800q-21 0 -35.5 14.5t-14.5 35.5v800q0 21 14.5 35.5t35.5 14.5h800q21 0 35.5 -14.5t14.5 -35.5z", forward: "M500 612v438q0 21 10.5 25t25.5 -10l492 -480q15 -14 15 -35t-15 -35l-492 -480q-15 -14 -25.5 -10t-10.5 25v438l-464 -453q-15 -14 -25.5 -10t-10.5 25v1000q0 21 10.5 25t25.5 -10z", "fast-forward": "M1048 1102l100 1q20 0 35 -14.5t15 -35.5l5 -1000q0 -21 -14.5 -35.5t-35.5 -14.5l-100 -1q-21 0 -35.5 14.5t-14.5 35.5l-2 437l-463 -454q-14 -15 -24.5 -10.5t-10.5 25.5l-2 437l-462 -455q-15 -14 -25.5 -9.5t-10.5 24.5l-5 1000q0 21 10.5 25.5t25.5 -10.5l466 -450 l-2 438q0 20 10.5 24.5t25.5 -9.5l466 -451l-2 438q0 21 14.5 35.5t35.5 14.5z", "step-forward": "M850 1100h100q21 0 35.5 -14.5t14.5 -35.5v-1000q0 -21 -14.5 -35.5t-35.5 -14.5h-100q-21 0 -35.5 14.5t-14.5 35.5v438l-464 -453q-15 -14 -25.5 -10t-10.5 25v1000q0 21 10.5 25t25.5 -10l464 -453v438q0 21 14.5 35.5t35.5 14.5z", eject: "M686 1081l501 -540q15 -15 10.5 -26t-26.5 -11h-1042q-22 0 -26.5 11t10.5 26l501 540q15 15 36 15t36 -15zM150 400h1000q21 0 35.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-35.5 -14.5h-1000q-21 0 -35.5 14.5t-14.5 35.5v100q0 21 14.5 35.5t35.5 14.5z", key: "M250 1200h600q21 0 35.5 -14.5t14.5 -35.5v-400q0 -21 -14.5 -35.5t-35.5 -14.5h-150v-500l-255 -178q-19 -9 -32 -1t-13 29v650h-150q-21 0 -35.5 14.5t-14.5 35.5v400q0 21 14.5 35.5t35.5 14.5zM400 1100v-100h300v100h-300z", exit: "M250 1200h750q39 0 69.5 -40.5t30.5 -84.5v-933l-700 -117v950l600 125h-700v-1000h-100v1025q0 23 15.5 49t34.5 26zM500 525v-100l100 20v100z", "plus-sign": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM650 900h-100q-21 0 -35.5 -14.5t-14.5 -35.5v-150h-150 q-21 0 -35.5 -14.5t-14.5 -35.5v-100q0 -21 14.5 -35.5t35.5 -14.5h150v-150q0 -21 14.5 -35.5t35.5 -14.5h100q21 0 35.5 14.5t14.5 35.5v150h150q21 0 35.5 14.5t14.5 35.5v100q0 21 -14.5 35.5t-35.5 14.5h-150v150q0 21 -14.5 35.5t-35.5 14.5z", "minus-sign": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM850 700h-500q-21 0 -35.5 -14.5t-14.5 -35.5v-100q0 -21 14.5 -35.5 t35.5 -14.5h500q21 0 35.5 14.5t14.5 35.5v100q0 21 -14.5 35.5t-35.5 14.5z", "remove-sign": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM741.5 913q-12.5 0 -21.5 -9l-120 -120l-120 120q-9 9 -21.5 9 t-21.5 -9l-141 -141q-9 -9 -9 -21.5t9 -21.5l120 -120l-120 -120q-9 -9 -9 -21.5t9 -21.5l141 -141q9 -9 21.5 -9t21.5 9l120 120l120 -120q9 -9 21.5 -9t21.5 9l141 141q9 9 9 21.5t-9 21.5l-120 120l120 120q9 9 9 21.5t-9 21.5l-141 141q-9 9 -21.5 9z", "ok-sign": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM546 623l-84 85q-7 7 -17.5 7t-18.5 -7l-139 -139q-7 -8 -7 -18t7 -18 l242 -241q7 -8 17.5 -8t17.5 8l375 375q7 7 7 17.5t-7 18.5l-139 139q-7 7 -17.5 7t-17.5 -7z", "question-sign": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM588 941q-29 0 -59 -5.5t-63 -20.5t-58 -38.5t-41.5 -63t-16.5 -89.5 q0 -25 20 -25h131q30 -5 35 11q6 20 20.5 28t45.5 8q20 0 31.5 -10.5t11.5 -28.5q0 -23 -7 -34t-26 -18q-1 0 -13.5 -4t-19.5 -7.5t-20 -10.5t-22 -17t-18.5 -24t-15.5 -35t-8 -46q-1 -8 5.5 -16.5t20.5 -8.5h173q7 0 22 8t35 28t37.5 48t29.5 74t12 100q0 47 -17 83 t-42.5 57t-59.5 34.5t-64 18t-59 4.5zM675 400h-150q-10 0 -17.5 -7.5t-7.5 -17.5v-150q0 -10 7.5 -17.5t17.5 -7.5h150q10 0 17.5 7.5t7.5 17.5v150q0 10 -7.5 17.5t-17.5 7.5z", "info-sign": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM675 1000h-150q-10 0 -17.5 -7.5t-7.5 -17.5v-150q0 -10 7.5 -17.5 t17.5 -7.5h150q10 0 17.5 7.5t7.5 17.5v150q0 10 -7.5 17.5t-17.5 7.5zM675 700h-250q-10 0 -17.5 -7.5t-7.5 -17.5v-50q0 -10 7.5 -17.5t17.5 -7.5h75v-200h-75q-10 0 -17.5 -7.5t-7.5 -17.5v-50q0 -10 7.5 -17.5t17.5 -7.5h350q10 0 17.5 7.5t7.5 17.5v50q0 10 -7.5 17.5 t-17.5 7.5h-75v275q0 10 -7.5 17.5t-17.5 7.5z", screenshot: "M525 1200h150q10 0 17.5 -7.5t7.5 -17.5v-194q103 -27 178.5 -102.5t102.5 -178.5h194q10 0 17.5 -7.5t7.5 -17.5v-150q0 -10 -7.5 -17.5t-17.5 -7.5h-194q-27 -103 -102.5 -178.5t-178.5 -102.5v-194q0 -10 -7.5 -17.5t-17.5 -7.5h-150q-10 0 -17.5 7.5t-7.5 17.5v194 q-103 27 -178.5 102.5t-102.5 178.5h-194q-10 0 -17.5 7.5t-7.5 17.5v150q0 10 7.5 17.5t17.5 7.5h194q27 103 102.5 178.5t178.5 102.5v194q0 10 7.5 17.5t17.5 7.5zM700 893v-168q0 -10 -7.5 -17.5t-17.5 -7.5h-150q-10 0 -17.5 7.5t-7.5 17.5v168q-68 -23 -119 -74 t-74 -119h168q10 0 17.5 -7.5t7.5 -17.5v-150q0 -10 -7.5 -17.5t-17.5 -7.5h-168q23 -68 74 -119t119 -74v168q0 10 7.5 17.5t17.5 7.5h150q10 0 17.5 -7.5t7.5 -17.5v-168q68 23 119 74t74 119h-168q-10 0 -17.5 7.5t-7.5 17.5v150q0 10 7.5 17.5t17.5 7.5h168 q-23 68 -74 119t-119 74z", "remove-circle": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM600 1027q-116 0 -214.5 -57t-155.5 -155.5t-57 -214.5t57 -214.5 t155.5 -155.5t214.5 -57t214.5 57t155.5 155.5t57 214.5t-57 214.5t-155.5 155.5t-214.5 57zM759 823l64 -64q7 -7 7 -17.5t-7 -17.5l-124 -124l124 -124q7 -7 7 -17.5t-7 -17.5l-64 -64q-7 -7 -17.5 -7t-17.5 7l-124 124l-124 -124q-7 -7 -17.5 -7t-17.5 7l-64 64 q-7 7 -7 17.5t7 17.5l124 124l-124 124q-7 7 -7 17.5t7 17.5l64 64q7 7 17.5 7t17.5 -7l124 -124l124 124q7 7 17.5 7t17.5 -7z", "ok-circle": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM600 1027q-116 0 -214.5 -57t-155.5 -155.5t-57 -214.5t57 -214.5 t155.5 -155.5t214.5 -57t214.5 57t155.5 155.5t57 214.5t-57 214.5t-155.5 155.5t-214.5 57zM782 788l106 -106q7 -7 7 -17.5t-7 -17.5l-320 -321q-8 -7 -18 -7t-18 7l-202 203q-8 7 -8 17.5t8 17.5l106 106q7 8 17.5 8t17.5 -8l79 -79l197 197q7 7 17.5 7t17.5 -7z", "ban-circle": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM600 1027q-116 0 -214.5 -57t-155.5 -155.5t-57 -214.5q0 -120 65 -225 l587 587q-105 65 -225 65zM965 819l-584 -584q104 -62 219 -62q116 0 214.5 57t155.5 155.5t57 214.5q0 115 -62 219z", "arrow-left": "M39 582l522 427q16 13 27.5 8t11.5 -26v-291h550q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-550v-291q0 -21 -11.5 -26t-27.5 8l-522 427q-16 13 -16 32t16 32z", "arrow-right": "M639 1009l522 -427q16 -13 16 -32t-16 -32l-522 -427q-16 -13 -27.5 -8t-11.5 26v291h-550q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5h550v291q0 21 11.5 26t27.5 -8z", "arrow-up": "M682 1161l427 -522q13 -16 8 -27.5t-26 -11.5h-291v-550q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v550h-291q-21 0 -26 11.5t8 27.5l427 522q13 16 32 16t32 -16z", "arrow-down": "M550 1200h200q21 0 35.5 -14.5t14.5 -35.5v-550h291q21 0 26 -11.5t-8 -27.5l-427 -522q-13 -16 -32 -16t-32 16l-427 522q-13 16 -8 27.5t26 11.5h291v550q0 21 14.5 35.5t35.5 14.5z", "share-alt": "M639 1109l522 -427q16 -13 16 -32t-16 -32l-522 -427q-16 -13 -27.5 -8t-11.5 26v291q-94 -2 -182 -20t-170.5 -52t-147 -92.5t-100.5 -135.5q5 105 27 193.5t67.5 167t113 135t167 91.5t225.5 42v262q0 21 11.5 26t27.5 -8z", "resize-full": "M850 1200h300q21 0 35.5 -14.5t14.5 -35.5v-300q0 -21 -10.5 -25t-24.5 10l-94 94l-249 -249q-8 -7 -18 -7t-18 7l-106 106q-7 8 -7 18t7 18l249 249l-94 94q-14 14 -10 24.5t25 10.5zM350 0h-300q-21 0 -35.5 14.5t-14.5 35.5v300q0 21 10.5 25t24.5 -10l94 -94l249 249 q8 7 18 7t18 -7l106 -106q7 -8 7 -18t-7 -18l-249 -249l94 -94q14 -14 10 -24.5t-25 -10.5z", "resize-small": "M1014 1120l106 -106q7 -8 7 -18t-7 -18l-249 -249l94 -94q14 -14 10 -24.5t-25 -10.5h-300q-21 0 -35.5 14.5t-14.5 35.5v300q0 21 10.5 25t24.5 -10l94 -94l249 249q8 7 18 7t18 -7zM250 600h300q21 0 35.5 -14.5t14.5 -35.5v-300q0 -21 -10.5 -25t-24.5 10l-94 94 l-249 -249q-8 -7 -18 -7t-18 7l-106 106q-7 8 -7 18t7 18l249 249l-94 94q-14 14 -10 24.5t25 10.5z", "exclamation-sign": "M600 1177q117 0 224 -45.5t184.5 -123t123 -184.5t45.5 -224t-45.5 -224t-123 -184.5t-184.5 -123t-224 -45.5t-224 45.5t-184.5 123t-123 184.5t-45.5 224t45.5 224t123 184.5t184.5 123t224 45.5zM704 900h-208q-20 0 -32 -14.5t-8 -34.5l58 -302q4 -20 21.5 -34.5 t37.5 -14.5h54q20 0 37.5 14.5t21.5 34.5l58 302q4 20 -8 34.5t-32 14.5zM675 400h-150q-10 0 -17.5 -7.5t-7.5 -17.5v-150q0 -10 7.5 -17.5t17.5 -7.5h150q10 0 17.5 7.5t7.5 17.5v150q0 10 -7.5 17.5t-17.5 7.5z", fire: "M653 1231q-39 -67 -54.5 -131t-10.5 -114.5t24.5 -96.5t47.5 -80t63.5 -62.5t68.5 -46.5t65 -30q-4 7 -17.5 35t-18.5 39.5t-17 39.5t-17 43t-13 42t-9.5 44.5t-2 42t4 43t13.5 39t23 38.5q96 -42 165 -107.5t105 -138t52 -156t13 -159t-19 -149.5q-13 -55 -44 -106.5 t-68 -87t-78.5 -64.5t-72.5 -45t-53 -22q-72 -22 -127 -11q-31 6 -13 19q6 3 17 7q13 5 32.5 21t41 44t38.5 63.5t21.5 81.5t-6.5 94.5t-50 107t-104 115.5q10 -104 -0.5 -189t-37 -140.5t-65 -93t-84 -52t-93.5 -11t-95 24.5q-80 36 -131.5 114t-53.5 171q-2 23 0 49.5 t4.5 52.5t13.5 56t27.5 60t46 64.5t69.5 68.5q-8 -53 -5 -102.5t17.5 -90t34 -68.5t44.5 -39t49 -2q31 13 38.5 36t-4.5 55t-29 64.5t-36 75t-26 75.5q-15 85 2 161.5t53.5 128.5t85.5 92.5t93.5 61t81.5 25.5z", "eye-open": "M600 1094q82 0 160.5 -22.5t140 -59t116.5 -82.5t94.5 -95t68 -95t42.5 -82.5t14 -57.5t-14 -57.5t-43 -82.5t-68.5 -95t-94.5 -95t-116.5 -82.5t-140 -59t-159.5 -22.5t-159.5 22.5t-140 59t-116.5 82.5t-94.5 95t-68.5 95t-43 82.5t-14 57.5t14 57.5t42.5 82.5t68 95 t94.5 95t116.5 82.5t140 59t160.5 22.5zM888 829q-15 15 -18 12t5 -22q25 -57 25 -119q0 -124 -88 -212t-212 -88t-212 88t-88 212q0 59 23 114q8 19 4.5 22t-17.5 -12q-70 -69 -160 -184q-13 -16 -15 -40.5t9 -42.5q22 -36 47 -71t70 -82t92.5 -81t113 -58.5t133.5 -24.5 t133.5 24t113 58.5t92.5 81.5t70 81.5t47 70.5q11 18 9 42.5t-14 41.5q-90 117 -163 189zM448 727l-35 -36q-15 -15 -19.5 -38.5t4.5 -41.5q37 -68 93 -116q16 -13 38.5 -11t36.5 17l35 34q14 15 12.5 33.5t-16.5 33.5q-44 44 -89 117q-11 18 -28 20t-32 -12z", "eye-close": "M592 0h-148l31 120q-91 20 -175.5 68.5t-143.5 106.5t-103.5 119t-66.5 110t-22 76q0 21 14 57.5t42.5 82.5t68 95t94.5 95t116.5 82.5t140 59t160.5 22.5q61 0 126 -15l32 121h148zM944 770l47 181q108 -85 176.5 -192t68.5 -159q0 -26 -19.5 -71t-59.5 -102t-93 -112 t-129 -104.5t-158 -75.5l46 173q77 49 136 117t97 131q11 18 9 42.5t-14 41.5q-54 70 -107 130zM310 824q-70 -69 -160 -184q-13 -16 -15 -40.5t9 -42.5q18 -30 39 -60t57 -70.5t74 -73t90 -61t105 -41.5l41 154q-107 18 -178.5 101.5t-71.5 193.5q0 59 23 114q8 19 4.5 22 t-17.5 -12zM448 727l-35 -36q-15 -15 -19.5 -38.5t4.5 -41.5q37 -68 93 -116q16 -13 38.5 -11t36.5 17l12 11l22 86l-3 4q-44 44 -89 117q-11 18 -28 20t-32 -12z", "warning-sign": "M-90 100l642 1066q20 31 48 28.5t48 -35.5l642 -1056q21 -32 7.5 -67.5t-50.5 -35.5h-1294q-37 0 -50.5 34t7.5 66zM155 200h345v75q0 10 7.5 17.5t17.5 7.5h150q10 0 17.5 -7.5t7.5 -17.5v-75h345l-445 723zM496 700h208q20 0 32 -14.5t8 -34.5l-58 -252 q-4 -20 -21.5 -34.5t-37.5 -14.5h-54q-20 0 -37.5 14.5t-21.5 34.5l-58 252q-4 20 8 34.5t32 14.5z", "shopping-cart": "M56 1200h94q17 0 31 -11t18 -27l38 -162h896q24 0 39 -18.5t10 -42.5l-100 -475q-5 -21 -27 -42.5t-55 -21.5h-633l48 -200h535q21 0 35.5 -14.5t14.5 -35.5t-14.5 -35.5t-35.5 -14.5h-50v-50q0 -21 -14.5 -35.5t-35.5 -14.5t-35.5 14.5t-14.5 35.5v50h-300v-50 q0 -21 -14.5 -35.5t-35.5 -14.5t-35.5 14.5t-14.5 35.5v50h-31q-18 0 -32.5 10t-20.5 19l-5 10l-201 961h-54q-20 0 -35 14.5t-15 35.5t15 35.5t35 14.5z", "folder-close": "M1200 1000v-100h-1200v100h200q0 41 29.5 70.5t70.5 29.5h300q41 0 70.5 -29.5t29.5 -70.5h500zM0 800h1200v-800h-1200v800z", "folder-open": "M200 800l-200 -400v600h200q0 41 29.5 70.5t70.5 29.5h300q42 0 71 -29.5t29 -70.5h500v-200h-1000zM1500 700l-300 -700h-1200l300 700h1200z", "resize-vertical": "M635 1184l230 -249q14 -14 10 -24.5t-25 -10.5h-150v-601h150q21 0 25 -10.5t-10 -24.5l-230 -249q-14 -15 -35 -15t-35 15l-230 249q-14 14 -10 24.5t25 10.5h150v601h-150q-21 0 -25 10.5t10 24.5l230 249q14 15 35 15t35 -15z", "resize-horizontal": "M936 864l249 -229q14 -15 14 -35.5t-14 -35.5l-249 -229q-15 -15 -25.5 -10.5t-10.5 24.5v151h-600v-151q0 -20 -10.5 -24.5t-25.5 10.5l-249 229q-14 15 -14 35.5t14 35.5l249 229q15 15 25.5 10.5t10.5 -25.5v-149h600v149q0 21 10.5 25.5t25.5 -10.5z", hdd: "M1169 400l-172 732q-5 23 -23 45.5t-38 22.5h-672q-20 0 -38 -20t-23 -41l-172 -739h1138zM1100 300h-1000q-41 0 -70.5 -29.5t-29.5 -70.5v-100q0 -41 29.5 -70.5t70.5 -29.5h1000q41 0 70.5 29.5t29.5 70.5v100q0 41 -29.5 70.5t-70.5 29.5zM800 100v100h100v-100h-100 zM1000 100v100h100v-100h-100z", bell: "M553 1200h94q20 0 29 -10.5t3 -29.5l-18 -37q83 -19 144 -82.5t76 -140.5l63 -327l118 -173h17q19 0 33 -14.5t14 -35t-13 -40.5t-31 -27q-8 -4 -23 -9.5t-65 -19.5t-103 -25t-132.5 -20t-158.5 -9q-57 0 -115 5t-104 12t-88.5 15.5t-73.5 17.5t-54.5 16t-35.5 12l-11 4 q-18 8 -31 28t-13 40.5t14 35t33 14.5h17l118 173l63 327q15 77 76 140t144 83l-18 32q-6 19 3.5 32t28.5 13zM498 110q50 -6 102 -6q53 0 102 6q-12 -49 -39.5 -79.5t-62.5 -30.5t-63 30.5t-39 79.5z", certificate: "M800 946l224 78l-78 -224l234 -45l-180 -155l180 -155l-234 -45l78 -224l-224 78l-45 -234l-155 180l-155 -180l-45 234l-224 -78l78 224l-234 45l180 155l-180 155l234 45l-78 224l224 -78l45 234l155 -180l155 180z", "thumbs-up": "M650 1200h50q40 0 70 -40.5t30 -84.5v-150l-28 -125h328q40 0 70 -40.5t30 -84.5v-100q0 -45 -29 -74l-238 -344q-16 -24 -38 -40.5t-45 -16.5h-250q-7 0 -42 25t-66 50l-31 25h-61q-45 0 -72.5 18t-27.5 57v400q0 36 20 63l145 196l96 198q13 28 37.5 48t51.5 20z M650 1100l-100 -212l-150 -213v-375h100l136 -100h214l250 375v125h-450l50 225v175h-50zM50 800h100q21 0 35.5 -14.5t14.5 -35.5v-500q0 -21 -14.5 -35.5t-35.5 -14.5h-100q-21 0 -35.5 14.5t-14.5 35.5v500q0 21 14.5 35.5t35.5 14.5z", "thumbs-down": "M600 1100h250q23 0 45 -16.5t38 -40.5l238 -344q29 -29 29 -74v-100q0 -44 -30 -84.5t-70 -40.5h-328q28 -118 28 -125v-150q0 -44 -30 -84.5t-70 -40.5h-50q-27 0 -51.5 20t-37.5 48l-96 198l-145 196q-20 27 -20 63v400q0 39 27.5 57t72.5 18h61q124 100 139 100z M50 1000h100q21 0 35.5 -14.5t14.5 -35.5v-500q0 -21 -14.5 -35.5t-35.5 -14.5h-100q-21 0 -35.5 14.5t-14.5 35.5v500q0 21 14.5 35.5t35.5 14.5zM636 1000l-136 -100h-100v-375l150 -213l100 -212h50v175l-50 225h450v125l-250 375h-214z", "hand-right": "M356 873l363 230q31 16 53 -6l110 -112q13 -13 13.5 -32t-11.5 -34l-84 -121h302q84 0 138 -38t54 -110t-55 -111t-139 -39h-106l-131 -339q-6 -21 -19.5 -41t-28.5 -20h-342q-7 0 -90 81t-83 94v525q0 17 14 35.5t28 28.5zM400 792v-503l100 -89h293l131 339 q6 21 19.5 41t28.5 20h203q21 0 30.5 25t0.5 50t-31 25h-456h-7h-6h-5.5t-6 0.5t-5 1.5t-5 2t-4 2.5t-4 4t-2.5 4.5q-12 25 5 47l146 183l-86 83zM50 800h100q21 0 35.5 -14.5t14.5 -35.5v-500q0 -21 -14.5 -35.5t-35.5 -14.5h-100q-21 0 -35.5 14.5t-14.5 35.5v500 q0 21 14.5 35.5t35.5 14.5z", "hand-left": "M475 1103l366 -230q2 -1 6 -3.5t14 -10.5t18 -16.5t14.5 -20t6.5 -22.5v-525q0 -13 -86 -94t-93 -81h-342q-15 0 -28.5 20t-19.5 41l-131 339h-106q-85 0 -139.5 39t-54.5 111t54 110t138 38h302l-85 121q-11 15 -10.5 34t13.5 32l110 112q22 22 53 6zM370 945l146 -183 q17 -22 5 -47q-2 -2 -3.5 -4.5t-4 -4t-4 -2.5t-5 -2t-5 -1.5t-6 -0.5h-6h-6.5h-6h-475v-100h221q15 0 29 -20t20 -41l130 -339h294l106 89v503l-342 236zM1050 800h100q21 0 35.5 -14.5t14.5 -35.5v-500q0 -21 -14.5 -35.5t-35.5 -14.5h-100q-21 0 -35.5 14.5t-14.5 35.5 v500q0 21 14.5 35.5t35.5 14.5z", "hand-up": "M550 1294q72 0 111 -55t39 -139v-106l339 -131q21 -6 41 -19.5t20 -28.5v-342q0 -7 -81 -90t-94 -83h-525q-17 0 -35.5 14t-28.5 28l-9 14l-230 363q-16 31 6 53l112 110q13 13 32 13.5t34 -11.5l121 -84v302q0 84 38 138t110 54zM600 972v203q0 21 -25 30.5t-50 0.5 t-25 -31v-456v-7v-6v-5.5t-0.5 -6t-1.5 -5t-2 -5t-2.5 -4t-4 -4t-4.5 -2.5q-25 -12 -47 5l-183 146l-83 -86l236 -339h503l89 100v293l-339 131q-21 6 -41 19.5t-20 28.5zM450 200h500q21 0 35.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-35.5 -14.5h-500 q-21 0 -35.5 14.5t-14.5 35.5v100q0 21 14.5 35.5t35.5 14.5z", "hand-down": "M350 1100h500q21 0 35.5 14.5t14.5 35.5v100q0 21 -14.5 35.5t-35.5 14.5h-500q-21 0 -35.5 -14.5t-14.5 -35.5v-100q0 -21 14.5 -35.5t35.5 -14.5zM600 306v-106q0 -84 -39 -139t-111 -55t-110 54t-38 138v302l-121 -84q-15 -12 -34 -11.5t-32 13.5l-112 110 q-22 22 -6 53l230 363q1 2 3.5 6t10.5 13.5t16.5 17t20 13.5t22.5 6h525q13 0 94 -83t81 -90v-342q0 -15 -20 -28.5t-41 -19.5zM308 900l-236 -339l83 -86l183 146q22 17 47 5q2 -1 4.5 -2.5t4 -4t2.5 -4t2 -5t1.5 -5t0.5 -6v-5.5v-6v-7v-456q0 -22 25 -31t50 0.5t25 30.5 v203q0 15 20 28.5t41 19.5l339 131v293l-89 100h-503z", "circle-arrow-right": "M600 1178q118 0 225 -45.5t184.5 -123t123 -184.5t45.5 -225t-45.5 -225t-123 -184.5t-184.5 -123t-225 -45.5t-225 45.5t-184.5 123t-123 184.5t-45.5 225t45.5 225t123 184.5t184.5 123t225 45.5zM914 632l-275 223q-16 13 -27.5 8t-11.5 -26v-137h-275 q-10 0 -17.5 -7.5t-7.5 -17.5v-150q0 -10 7.5 -17.5t17.5 -7.5h275v-137q0 -21 11.5 -26t27.5 8l275 223q16 13 16 32t-16 32z", "circle-arrow-left": "M600 1178q118 0 225 -45.5t184.5 -123t123 -184.5t45.5 -225t-45.5 -225t-123 -184.5t-184.5 -123t-225 -45.5t-225 45.5t-184.5 123t-123 184.5t-45.5 225t45.5 225t123 184.5t184.5 123t225 45.5zM561 855l-275 -223q-16 -13 -16 -32t16 -32l275 -223q16 -13 27.5 -8 t11.5 26v137h275q10 0 17.5 7.5t7.5 17.5v150q0 10 -7.5 17.5t-17.5 7.5h-275v137q0 21 -11.5 26t-27.5 -8z", "circle-arrow-up": "M600 1178q118 0 225 -45.5t184.5 -123t123 -184.5t45.5 -225t-45.5 -225t-123 -184.5t-184.5 -123t-225 -45.5t-225 45.5t-184.5 123t-123 184.5t-45.5 225t45.5 225t123 184.5t184.5 123t225 45.5zM855 639l-223 275q-13 16 -32 16t-32 -16l-223 -275q-13 -16 -8 -27.5 t26 -11.5h137v-275q0 -10 7.5 -17.5t17.5 -7.5h150q10 0 17.5 7.5t7.5 17.5v275h137q21 0 26 11.5t-8 27.5z", "circle-arrow-down": "M600 1178q118 0 225 -45.5t184.5 -123t123 -184.5t45.5 -225t-45.5 -225t-123 -184.5t-184.5 -123t-225 -45.5t-225 45.5t-184.5 123t-123 184.5t-45.5 225t45.5 225t123 184.5t184.5 123t225 45.5zM675 900h-150q-10 0 -17.5 -7.5t-7.5 -17.5v-275h-137q-21 0 -26 -11.5 t8 -27.5l223 -275q13 -16 32 -16t32 16l223 275q13 16 8 27.5t-26 11.5h-137v275q0 10 -7.5 17.5t-17.5 7.5z", globe: "M600 1176q116 0 222.5 -46t184 -123.5t123.5 -184t46 -222.5t-46 -222.5t-123.5 -184t-184 -123.5t-222.5 -46t-222.5 46t-184 123.5t-123.5 184t-46 222.5t46 222.5t123.5 184t184 123.5t222.5 46zM627 1101q-15 -12 -36.5 -20.5t-35.5 -12t-43 -8t-39 -6.5 q-15 -3 -45.5 0t-45.5 -2q-20 -7 -51.5 -26.5t-34.5 -34.5q-3 -11 6.5 -22.5t8.5 -18.5q-3 -34 -27.5 -91t-29.5 -79q-9 -34 5 -93t8 -87q0 -9 17 -44.5t16 -59.5q12 0 23 -5t23.5 -15t19.5 -14q16 -8 33 -15t40.5 -15t34.5 -12q21 -9 52.5 -32t60 -38t57.5 -11 q7 -15 -3 -34t-22.5 -40t-9.5 -38q13 -21 23 -34.5t27.5 -27.5t36.5 -18q0 -7 -3.5 -16t-3.5 -14t5 -17q104 -2 221 112q30 29 46.5 47t34.5 49t21 63q-13 8 -37 8.5t-36 7.5q-15 7 -49.5 15t-51.5 19q-18 0 -41 -0.5t-43 -1.5t-42 -6.5t-38 -16.5q-51 -35 -66 -12 q-4 1 -3.5 25.5t0.5 25.5q-6 13 -26.5 17.5t-24.5 6.5q1 15 -0.5 30.5t-7 28t-18.5 11.5t-31 -21q-23 -25 -42 4q-19 28 -8 58q6 16 22 22q6 -1 26 -1.5t33.5 -4t19.5 -13.5q7 -12 18 -24t21.5 -20.5t20 -15t15.5 -10.5l5 -3q2 12 7.5 30.5t8 34.5t-0.5 32q-3 18 3.5 29 t18 22.5t15.5 24.5q6 14 10.5 35t8 31t15.5 22.5t34 22.5q-6 18 10 36q8 0 24 -1.5t24.5 -1.5t20 4.5t20.5 15.5q-10 23 -31 42.5t-37.5 29.5t-49 27t-43.5 23q0 1 2 8t3 11.5t1.5 10.5t-1 9.5t-4.5 4.5q31 -13 58.5 -14.5t38.5 2.5l12 5q5 28 -9.5 46t-36.5 24t-50 15 t-41 20q-18 -4 -37 0zM613 994q0 -17 8 -42t17 -45t9 -23q-8 1 -39.5 5.5t-52.5 10t-37 16.5q3 11 16 29.5t16 25.5q10 -10 19 -10t14 6t13.5 14.5t16.5 12.5z", wrench: "M756 1157q164 92 306 -9l-259 -138l145 -232l251 126q6 -89 -34 -156.5t-117 -110.5q-60 -34 -127 -39.5t-126 16.5l-596 -596q-15 -16 -36.5 -16t-36.5 16l-111 110q-15 15 -15 36.5t15 37.5l600 599q-34 101 5.5 201.5t135.5 154.5z", tasks: "M100 1196h1000q41 0 70.5 -29.5t29.5 -70.5v-100q0 -41 -29.5 -70.5t-70.5 -29.5h-1000q-41 0 -70.5 29.5t-29.5 70.5v100q0 41 29.5 70.5t70.5 29.5zM1100 1096h-200v-100h200v100zM100 796h1000q41 0 70.5 -29.5t29.5 -70.5v-100q0 -41 -29.5 -70.5t-70.5 -29.5h-1000 q-41 0 -70.5 29.5t-29.5 70.5v100q0 41 29.5 70.5t70.5 29.5zM1100 696h-500v-100h500v100zM100 396h1000q41 0 70.5 -29.5t29.5 -70.5v-100q0 -41 -29.5 -70.5t-70.5 -29.5h-1000q-41 0 -70.5 29.5t-29.5 70.5v100q0 41 29.5 70.5t70.5 29.5zM1100 296h-300v-100h300v100z ", filter: "M150 1200h900q21 0 35.5 -14.5t14.5 -35.5t-14.5 -35.5t-35.5 -14.5h-900q-21 0 -35.5 14.5t-14.5 35.5t14.5 35.5t35.5 14.5zM700 500v-300l-200 -200v500l-350 500h900z", fullscreen: "M50 1200h300q21 0 25 -10.5t-10 -24.5l-94 -94l199 -199q7 -8 7 -18t-7 -18l-106 -106q-8 -7 -18 -7t-18 7l-199 199l-94 -94q-14 -14 -24.5 -10t-10.5 25v300q0 21 14.5 35.5t35.5 14.5zM850 1200h300q21 0 35.5 -14.5t14.5 -35.5v-300q0 -21 -10.5 -25t-24.5 10l-94 94 l-199 -199q-8 -7 -18 -7t-18 7l-106 106q-7 8 -7 18t7 18l199 199l-94 94q-14 14 -10 24.5t25 10.5zM364 470l106 -106q7 -8 7 -18t-7 -18l-199 -199l94 -94q14 -14 10 -24.5t-25 -10.5h-300q-21 0 -35.5 14.5t-14.5 35.5v300q0 21 10.5 25t24.5 -10l94 -94l199 199 q8 7 18 7t18 -7zM1071 271l94 94q14 14 24.5 10t10.5 -25v-300q0 -21 -14.5 -35.5t-35.5 -14.5h-300q-21 0 -25 10.5t10 24.5l94 94l-199 199q-7 8 -7 18t7 18l106 106q8 7 18 7t18 -7z", dashboard: "M596 1192q121 0 231.5 -47.5t190 -127t127 -190t47.5 -231.5t-47.5 -231.5t-127 -190.5t-190 -127t-231.5 -47t-231.5 47t-190.5 127t-127 190.5t-47 231.5t47 231.5t127 190t190.5 127t231.5 47.5zM596 1010q-112 0 -207.5 -55.5t-151 -151t-55.5 -207.5t55.5 -207.5 t151 -151t207.5 -55.5t207.5 55.5t151 151t55.5 207.5t-55.5 207.5t-151 151t-207.5 55.5zM454.5 905q22.5 0 38.5 -16t16 -38.5t-16 -39t-38.5 -16.5t-38.5 16.5t-16 39t16 38.5t38.5 16zM754.5 905q22.5 0 38.5 -16t16 -38.5t-16 -39t-38 -16.5q-14 0 -29 10l-55 -145 q17 -23 17 -51q0 -36 -25.5 -61.5t-61.5 -25.5t-61.5 25.5t-25.5 61.5q0 32 20.5 56.5t51.5 29.5l122 126l1 1q-9 14 -9 28q0 23 16 39t38.5 16zM345.5 709q22.5 0 38.5 -16t16 -38.5t-16 -38.5t-38.5 -16t-38.5 16t-16 38.5t16 38.5t38.5 16zM854.5 709q22.5 0 38.5 -16 t16 -38.5t-16 -38.5t-38.5 -16t-38.5 16t-16 38.5t16 38.5t38.5 16z", paperclip: "M546 173l469 470q91 91 99 192q7 98 -52 175.5t-154 94.5q-22 4 -47 4q-34 0 -66.5 -10t-56.5 -23t-55.5 -38t-48 -41.5t-48.5 -47.5q-376 -375 -391 -390q-30 -27 -45 -41.5t-37.5 -41t-32 -46.5t-16 -47.5t-1.5 -56.5q9 -62 53.5 -95t99.5 -33q74 0 125 51l548 548 q36 36 20 75q-7 16 -21.5 26t-32.5 10q-26 0 -50 -23q-13 -12 -39 -38l-341 -338q-15 -15 -35.5 -15.5t-34.5 13.5t-14 34.5t14 34.5q327 333 361 367q35 35 67.5 51.5t78.5 16.5q14 0 29 -1q44 -8 74.5 -35.5t43.5 -68.5q14 -47 2 -96.5t-47 -84.5q-12 -11 -32 -32 t-79.5 -81t-114.5 -115t-124.5 -123.5t-123 -119.5t-96.5 -89t-57 -45q-56 -27 -120 -27q-70 0 -129 32t-93 89q-48 78 -35 173t81 163l511 511q71 72 111 96q91 55 198 55q80 0 152 -33q78 -36 129.5 -103t66.5 -154q17 -93 -11 -183.5t-94 -156.5l-482 -476 q-15 -15 -36 -16t-37 14t-17.5 34t14.5 35z", "heart-empty": "M649 949q48 68 109.5 104t121.5 38.5t118.5 -20t102.5 -64t71 -100.5t27 -123q0 -57 -33.5 -117.5t-94 -124.5t-126.5 -127.5t-150 -152.5t-146 -174q-62 85 -145.5 174t-150 152.5t-126.5 127.5t-93.5 124.5t-33.5 117.5q0 64 28 123t73 100.5t104 64t119 20 t120.5 -38.5t104.5 -104zM896 972q-33 0 -64.5 -19t-56.5 -46t-47.5 -53.5t-43.5 -45.5t-37.5 -19t-36 19t-40 45.5t-43 53.5t-54 46t-65.5 19q-67 0 -122.5 -55.5t-55.5 -132.5q0 -23 13.5 -51t46 -65t57.5 -63t76 -75l22 -22q15 -14 44 -44t50.5 -51t46 -44t41 -35t23 -12 t23.5 12t42.5 36t46 44t52.5 52t44 43q4 4 12 13q43 41 63.5 62t52 55t46 55t26 46t11.5 44q0 79 -53 133.5t-120 54.5z", pushpin: "M902 1185l283 -282q15 -15 15 -36t-14.5 -35.5t-35.5 -14.5t-35 15l-36 35l-279 -267v-300l-212 210l-308 -307l-280 -203l203 280l307 308l-210 212h300l267 279l-35 36q-15 14 -15 35t14.5 35.5t35.5 14.5t35 -15z", sort: "M400 300h150q21 0 25 -11t-10 -25l-230 -250q-14 -15 -35 -15t-35 15l-230 250q-14 14 -10 25t25 11h150v900h200v-900zM935 1184l230 -249q14 -14 10 -24.5t-25 -10.5h-150v-900h-200v900h-150q-21 0 -25 10.5t10 24.5l230 249q14 15 35 15t35 -15z", "sort-by-alphabet": "M1000 700h-100v100h-100v-100h-100v500h300v-500zM400 300h150q21 0 25 -11t-10 -25l-230 -250q-14 -15 -35 -15t-35 15l-230 250q-14 14 -10 25t25 11h150v900h200v-900zM801 1100v-200h100v200h-100zM1000 350l-200 -250h200v-100h-300v150l200 250h-200v100h300v-150z ", "sort-by-alphabet-alt": "M400 300h150q21 0 25 -11t-10 -25l-230 -250q-14 -15 -35 -15t-35 15l-230 250q-14 14 -10 25t25 11h150v900h200v-900zM1000 1050l-200 -250h200v-100h-300v150l200 250h-200v100h300v-150zM1000 0h-100v100h-100v-100h-100v500h300v-500zM801 400v-200h100v200h-100z ", "sort-by-order": "M400 300h150q21 0 25 -11t-10 -25l-230 -250q-14 -15 -35 -15t-35 15l-230 250q-14 14 -10 25t25 11h150v900h200v-900zM1000 700h-100v400h-100v100h200v-500zM1100 0h-100v100h-200v400h300v-500zM901 400v-200h100v200h-100z", "sort-by-order-alt": "M400 300h150q21 0 25 -11t-10 -25l-230 -250q-14 -15 -35 -15t-35 15l-230 250q-14 14 -10 25t25 11h150v900h200v-900zM1100 700h-100v100h-200v400h300v-500zM901 1100v-200h100v200h-100zM1000 0h-100v400h-100v100h200v-500z", "sort-by-attributes": "M400 300h150q21 0 25 -11t-10 -25l-230 -250q-14 -15 -35 -15t-35 15l-230 250q-14 14 -10 25t25 11h150v900h200v-900zM900 1000h-200v200h200v-200zM1000 700h-300v200h300v-200zM1100 400h-400v200h400v-200zM1200 100h-500v200h500v-200z", "sort-by-attributes-alt": "M400 300h150q21 0 25 -11t-10 -25l-230 -250q-14 -15 -35 -15t-35 15l-230 250q-14 14 -10 25t25 11h150v900h200v-900zM1200 1000h-500v200h500v-200zM1100 700h-400v200h400v-200zM1000 400h-300v200h300v-200zM900 100h-200v200h200v-200z", login: "M550 1100h400q165 0 257.5 -92.5t92.5 -257.5v-400q0 -165 -92.5 -257.5t-257.5 -92.5h-400q-21 0 -35.5 14.5t-14.5 35.5v100q0 21 14.5 35.5t35.5 14.5h450q41 0 70.5 29.5t29.5 70.5v500q0 41 -29.5 70.5t-70.5 29.5h-450q-21 0 -35.5 14.5t-14.5 35.5v100 q0 21 14.5 35.5t35.5 14.5zM338 867l324 -284q16 -14 16 -33t-16 -33l-324 -284q-16 -14 -27 -9t-11 26v150h-250q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5h250v150q0 21 11 26t27 -9z", flash: "M793 1182l9 -9q8 -10 5 -27q-3 -11 -79 -225.5t-78 -221.5l300 1q24 0 32.5 -17.5t-5.5 -35.5q-1 0 -133.5 -155t-267 -312.5t-138.5 -162.5q-12 -15 -26 -15h-9l-9 8q-9 11 -4 32q2 9 42 123.5t79 224.5l39 110h-302q-23 0 -31 19q-10 21 6 41q75 86 209.5 237.5 t228 257t98.5 111.5q9 16 25 16h9z", "log-out": "M350 1100h400q21 0 35.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-35.5 -14.5h-450q-41 0 -70.5 -29.5t-29.5 -70.5v-500q0 -41 29.5 -70.5t70.5 -29.5h450q21 0 35.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-35.5 -14.5h-400q-165 0 -257.5 92.5t-92.5 257.5v400 q0 165 92.5 257.5t257.5 92.5zM938 867l324 -284q16 -14 16 -33t-16 -33l-324 -284q-16 -14 -27 -9t-11 26v150h-250q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5h250v150q0 21 11 26t27 -9z", "new window": "M750 1200h400q21 0 35.5 -14.5t14.5 -35.5v-400q0 -21 -10.5 -25t-24.5 10l-109 109l-312 -312q-15 -15 -35.5 -15t-35.5 15l-141 141q-15 15 -15 35.5t15 35.5l312 312l-109 109q-14 14 -10 24.5t25 10.5zM456 900h-156q-41 0 -70.5 -29.5t-29.5 -70.5v-500 q0 -41 29.5 -70.5t70.5 -29.5h500q41 0 70.5 29.5t29.5 70.5v148l200 200v-298q0 -165 -93.5 -257.5t-256.5 -92.5h-400q-165 0 -257.5 92.5t-92.5 257.5v400q0 165 92.5 257.5t257.5 92.5h300z", record: "M600 1186q119 0 227.5 -46.5t187 -125t125 -187t46.5 -227.5t-46.5 -227.5t-125 -187t-187 -125t-227.5 -46.5t-227.5 46.5t-187 125t-125 187t-46.5 227.5t46.5 227.5t125 187t187 125t227.5 46.5zM600 1022q-115 0 -212 -56.5t-153.5 -153.5t-56.5 -212t56.5 -212 t153.5 -153.5t212 -56.5t212 56.5t153.5 153.5t56.5 212t-56.5 212t-153.5 153.5t-212 56.5zM600 794q80 0 137 -57t57 -137t-57 -137t-137 -57t-137 57t-57 137t57 137t137 57z", save: "M450 1200h200q21 0 35.5 -14.5t14.5 -35.5v-350h245q20 0 25 -11t-9 -26l-383 -426q-14 -15 -33.5 -15t-32.5 15l-379 426q-13 15 -8.5 26t25.5 11h250v350q0 21 14.5 35.5t35.5 14.5zM50 300h1000q21 0 35.5 -14.5t14.5 -35.5v-250h-1100v250q0 21 14.5 35.5t35.5 14.5z M900 200v-50h100v50h-100z", open: "M583 1182l378 -435q14 -15 9 -31t-26 -16h-244v-250q0 -20 -17 -35t-39 -15h-200q-20 0 -32 14.5t-12 35.5v250h-250q-20 0 -25.5 16.5t8.5 31.5l383 431q14 16 33.5 17t33.5 -14zM50 300h1000q21 0 35.5 -14.5t14.5 -35.5v-250h-1100v250q0 21 14.5 35.5t35.5 14.5z M900 200v-50h100v50h-100z", "floppy-disk": "M1100 1000v-850q0 -21 -14.5 -35.5t-35.5 -14.5h-150v400h-700v-400h-150q-21 0 -35.5 14.5t-14.5 35.5v1000q0 20 14.5 35t35.5 15h250v-300h500v300h100zM700 1000h-100v200h100v-200z", "floppy-saved": "M1100 1000l-2 -149l-299 -299l-95 95q-9 9 -21.5 9t-21.5 -9l-149 -147h-312v-400h-150q-21 0 -35.5 14.5t-14.5 35.5v1000q0 20 14.5 35t35.5 15h250v-300h500v300h100zM700 1000h-100v200h100v-200zM1132 638l106 -106q7 -7 7 -17.5t-7 -17.5l-420 -421q-8 -7 -18 -7 t-18 7l-202 203q-8 7 -8 17.5t8 17.5l106 106q7 8 17.5 8t17.5 -8l79 -79l297 297q7 7 17.5 7t17.5 -7z", "floppy-remove": "M1100 1000v-269l-103 -103l-134 134q-15 15 -33.5 16.5t-34.5 -12.5l-266 -266h-329v-400h-150q-21 0 -35.5 14.5t-14.5 35.5v1000q0 20 14.5 35t35.5 15h250v-300h500v300h100zM700 1000h-100v200h100v-200zM1202 572l70 -70q15 -15 15 -35.5t-15 -35.5l-131 -131 l131 -131q15 -15 15 -35.5t-15 -35.5l-70 -70q-15 -15 -35.5 -15t-35.5 15l-131 131l-131 -131q-15 -15 -35.5 -15t-35.5 15l-70 70q-15 15 -15 35.5t15 35.5l131 131l-131 131q-15 15 -15 35.5t15 35.5l70 70q15 15 35.5 15t35.5 -15l131 -131l131 131q15 15 35.5 15 t35.5 -15z", "floppy-save": "M1100 1000v-300h-350q-21 0 -35.5 -14.5t-14.5 -35.5v-150h-500v-400h-150q-21 0 -35.5 14.5t-14.5 35.5v1000q0 20 14.5 35t35.5 15h250v-300h500v300h100zM700 1000h-100v200h100v-200zM850 600h100q21 0 35.5 -14.5t14.5 -35.5v-250h150q21 0 25 -10.5t-10 -24.5 l-230 -230q-14 -14 -35 -14t-35 14l-230 230q-14 14 -10 24.5t25 10.5h150v250q0 21 14.5 35.5t35.5 14.5z", "floppy-open": "M1100 1000v-400l-165 165q-14 15 -35 15t-35 -15l-263 -265h-402v-400h-150q-21 0 -35.5 14.5t-14.5 35.5v1000q0 20 14.5 35t35.5 15h250v-300h500v300h100zM700 1000h-100v200h100v-200zM935 565l230 -229q14 -15 10 -25.5t-25 -10.5h-150v-250q0 -20 -14.5 -35 t-35.5 -15h-100q-21 0 -35.5 15t-14.5 35v250h-150q-21 0 -25 10.5t10 25.5l230 229q14 15 35 15t35 -15z", "credit-card": "M50 1100h1100q21 0 35.5 -14.5t14.5 -35.5v-150h-1200v150q0 21 14.5 35.5t35.5 14.5zM1200 800v-550q0 -21 -14.5 -35.5t-35.5 -14.5h-1100q-21 0 -35.5 14.5t-14.5 35.5v550h1200zM100 500v-200h400v200h-400z", transfer: "M935 1165l248 -230q14 -14 14 -35t-14 -35l-248 -230q-14 -14 -24.5 -10t-10.5 25v150h-400v200h400v150q0 21 10.5 25t24.5 -10zM200 800h-50q-21 0 -35.5 14.5t-14.5 35.5v100q0 21 14.5 35.5t35.5 14.5h50v-200zM400 800h-100v200h100v-200zM18 435l247 230 q14 14 24.5 10t10.5 -25v-150h400v-200h-400v-150q0 -21 -10.5 -25t-24.5 10l-247 230q-15 14 -15 35t15 35zM900 300h-100v200h100v-200zM1000 500h51q20 0 34.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-34.5 -14.5h-51v200z", "sd-video": "M200 1100h700q124 0 212 -88t88 -212v-500q0 -124 -88 -212t-212 -88h-700q-124 0 -212 88t-88 212v500q0 124 88 212t212 88zM100 900v-700h900v700h-900zM500 700h-200v-100h200v-300h-300v100h200v100h-200v300h300v-100zM900 700v-300l-100 -100h-200v500h200z M700 700v-300h100v300h-100z", "cloud-download": "M503 1089q110 0 200.5 -59.5t134.5 -156.5q44 14 90 14q120 0 205 -86.5t85 -207t-85 -207t-205 -86.5h-128v250q0 21 -14.5 35.5t-35.5 14.5h-300q-21 0 -35.5 -14.5t-14.5 -35.5v-250h-222q-80 0 -136 57.5t-56 136.5q0 69 43 122.5t108 67.5q-2 19 -2 37q0 100 49 185 t134 134t185 49zM525 500h150q10 0 17.5 -7.5t7.5 -17.5v-275h137q21 0 26 -11.5t-8 -27.5l-223 -244q-13 -16 -32 -16t-32 16l-223 244q-13 16 -8 27.5t26 11.5h137v275q0 10 7.5 17.5t17.5 7.5z", "cloud-upload": "M502 1089q110 0 201 -59.5t135 -156.5q43 15 89 15q121 0 206 -86.5t86 -206.5q0 -99 -60 -181t-150 -110l-378 360q-13 16 -31.5 16t-31.5 -16l-381 -365h-9q-79 0 -135.5 57.5t-56.5 136.5q0 69 43 122.5t108 67.5q-2 19 -2 38q0 100 49 184.5t133.5 134t184.5 49.5z M632 467l223 -228q13 -16 8 -27.5t-26 -11.5h-137v-275q0 -10 -7.5 -17.5t-17.5 -7.5h-150q-10 0 -17.5 7.5t-7.5 17.5v275h-137q-21 0 -26 11.5t8 27.5q199 204 223 228q19 19 31.5 19t32.5 -19z", cd: "M1010 1010q111 -111 150.5 -260.5t0 -299t-150.5 -260.5q-83 -83 -191.5 -126.5t-218.5 -43.5t-218.5 43.5t-191.5 126.5q-111 111 -150.5 260.5t0 299t150.5 260.5q83 83 191.5 126.5t218.5 43.5t218.5 -43.5t191.5 -126.5zM476 1065q-4 0 -8 -1q-121 -34 -209.5 -122.5 t-122.5 -209.5q-4 -12 2.5 -23t18.5 -14l36 -9q3 -1 7 -1q23 0 29 22q27 96 98 166q70 71 166 98q11 3 17.5 13.5t3.5 22.5l-9 35q-3 13 -14 19q-7 4 -15 4zM512 920q-4 0 -9 -2q-80 -24 -138.5 -82.5t-82.5 -138.5q-4 -13 2 -24t19 -14l34 -9q4 -1 8 -1q22 0 28 21 q18 58 58.5 98.5t97.5 58.5q12 3 18 13.5t3 21.5l-9 35q-3 12 -14 19q-7 4 -15 4zM719.5 719.5q-49.5 49.5 -119.5 49.5t-119.5 -49.5t-49.5 -119.5t49.5 -119.5t119.5 -49.5t119.5 49.5t49.5 119.5t-49.5 119.5zM855 551q-22 0 -28 -21q-18 -58 -58.5 -98.5t-98.5 -57.5 q-11 -4 -17 -14.5t-3 -21.5l9 -35q3 -12 14 -19q7 -4 15 -4q4 0 9 2q80 24 138.5 82.5t82.5 138.5q4 13 -2.5 24t-18.5 14l-34 9q-4 1 -8 1zM1000 515q-23 0 -29 -22q-27 -96 -98 -166q-70 -71 -166 -98q-11 -3 -17.5 -13.5t-3.5 -22.5l9 -35q3 -13 14 -19q7 -4 15 -4 q4 0 8 1q121 34 209.5 122.5t122.5 209.5q4 12 -2.5 23t-18.5 14l-36 9q-3 1 -7 1z", "save-file": "M700 800h300v-380h-180v200h-340v-200h-380v755q0 10 7.5 17.5t17.5 7.5h575v-400zM1000 900h-200v200zM700 300h162l-212 -212l-212 212h162v200h100v-200zM520 0h-395q-10 0 -17.5 7.5t-7.5 17.5v395zM1000 220v-195q0 -10 -7.5 -17.5t-17.5 -7.5h-195z", "open-file": "M700 800h300v-520l-350 350l-550 -550v1095q0 10 7.5 17.5t17.5 7.5h575v-400zM1000 900h-200v200zM862 200h-162v-200h-100v200h-162l212 212zM480 0h-355q-10 0 -17.5 7.5t-7.5 17.5v55h380v-80zM1000 80v-55q0 -10 -7.5 -17.5t-17.5 -7.5h-155v80h180z", "level-up": "M1162 800h-162v-200h100l100 -100h-300v300h-162l212 212zM200 800h200q27 0 40 -2t29.5 -10.5t23.5 -30t7 -57.5h300v-100h-600l-200 -350v450h100q0 36 7 57.5t23.5 30t29.5 10.5t40 2zM800 400h240l-240 -400h-800l300 500h500v-100z", copy: "M650 1100h100q21 0 35.5 -14.5t14.5 -35.5v-50h50q21 0 35.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-35.5 -14.5h-300q-21 0 -35.5 14.5t-14.5 35.5v100q0 21 14.5 35.5t35.5 14.5h50v50q0 21 14.5 35.5t35.5 14.5zM1000 850v150q41 0 70.5 -29.5t29.5 -70.5v-800 q0 -41 -29.5 -70.5t-70.5 -29.5h-600q-1 0 -20 4l246 246l-326 326v324q0 41 29.5 70.5t70.5 29.5v-150q0 -62 44 -106t106 -44h300q62 0 106 44t44 106zM412 250l-212 -212v162h-200v100h200v162z", paste: "M450 1100h100q21 0 35.5 -14.5t14.5 -35.5v-50h50q21 0 35.5 -14.5t14.5 -35.5v-100q0 -21 -14.5 -35.5t-35.5 -14.5h-300q-21 0 -35.5 14.5t-14.5 35.5v100q0 21 14.5 35.5t35.5 14.5h50v50q0 21 14.5 35.5t35.5 14.5zM800 850v150q41 0 70.5 -29.5t29.5 -70.5v-500 h-200v-300h200q0 -36 -7 -57.5t-23.5 -30t-29.5 -10.5t-40 -2h-600q-41 0 -70.5 29.5t-29.5 70.5v800q0 41 29.5 70.5t70.5 29.5v-150q0 -62 44 -106t106 -44h300q62 0 106 44t44 106zM1212 250l-212 -212v162h-200v100h200v162z", alert: "M658 1197l637 -1104q23 -38 7 -65.5t-60 -27.5h-1276q-44 0 -60 27.5t7 65.5l637 1104q22 39 54 39t54 -39zM704 800h-208q-20 0 -32 -14.5t-8 -34.5l58 -302q4 -20 21.5 -34.5t37.5 -14.5h54q20 0 37.5 14.5t21.5 34.5l58 302q4 20 -8 34.5t-32 14.5zM500 300v-100h200 v100h-200z", duplicate: "M900 800h300v-575q0 -10 -7.5 -17.5t-17.5 -7.5h-375v591l-300 300v84q0 10 7.5 17.5t17.5 7.5h375v-400zM1200 900h-200v200zM400 600h300v-575q0 -10 -7.5 -17.5t-17.5 -7.5h-650q-10 0 -17.5 7.5t-7.5 17.5v950q0 10 7.5 17.5t17.5 7.5h375v-400zM700 700h-200v200z ", scissors: "M641 900l423 247q19 8 42 2.5t37 -21.5l32 -38q14 -15 12.5 -36t-17.5 -34l-139 -120h-390zM50 1100h106q67 0 103 -17t66 -71l102 -212h823q21 0 35.5 -14.5t14.5 -35.5v-50q0 -21 -14 -40t-33 -26l-737 -132q-23 -4 -40 6t-26 25q-42 67 -100 67h-300q-62 0 -106 44 t-44 106v200q0 62 44 106t106 44zM173 928h-80q-19 0 -28 -14t-9 -35v-56q0 -51 42 -51h134q16 0 21.5 8t5.5 24q0 11 -16 45t-27 51q-18 28 -43 28zM550 727q-32 0 -54.5 -22.5t-22.5 -54.5t22.5 -54.5t54.5 -22.5t54.5 22.5t22.5 54.5t-22.5 54.5t-54.5 22.5zM130 389 l152 130q18 19 34 24t31 -3.5t24.5 -17.5t25.5 -28q28 -35 50.5 -51t48.5 -13l63 5l48 -179q13 -61 -3.5 -97.5t-67.5 -79.5l-80 -69q-47 -40 -109 -35.5t-103 51.5l-130 151q-40 47 -35.5 109.5t51.5 102.5zM380 377l-102 -88q-31 -27 2 -65l37 -43q13 -15 27.5 -19.5 t31.5 6.5l61 53q19 16 14 49q-2 20 -12 56t-17 45q-11 12 -19 14t-23 -8z", scale: "M212 1198h780q86 0 147 -61t61 -147v-416q0 -51 -18 -142.5t-36 -157.5l-18 -66q-29 -87 -93.5 -146.5t-146.5 -59.5h-572q-82 0 -147 59t-93 147q-8 28 -20 73t-32 143.5t-20 149.5v416q0 86 61 147t147 61zM600 1045q-70 0 -132.5 -11.5t-105.5 -30.5t-78.5 -41.5 t-57 -45t-36 -41t-20.5 -30.5l-6 -12l156 -243h560l156 243q-2 5 -6 12.5t-20 29.5t-36.5 42t-57 44.5t-79 42t-105 29.5t-132.5 12zM762 703h-157l195 261z", "ice-lolly": "M475 1300h150q103 0 189 -86t86 -189v-500q0 -41 -42 -83t-83 -42h-450q-41 0 -83 42t-42 83v500q0 103 86 189t189 86zM700 300v-225q0 -21 -27 -48t-48 -27h-150q-21 0 -48 27t-27 48v225h300z", "triangle-right": "M865 565l-494 -494q-23 -23 -41 -23q-14 0 -22 13.5t-8 38.5v1000q0 25 8 38.5t22 13.5q18 0 41 -23l494 -494q14 -14 14 -35t-14 -35z", "triangle-left": "M335 635l494 494q29 29 50 20.5t21 -49.5v-1000q0 -41 -21 -49.5t-50 20.5l-494 494q-14 14 -14 35t14 35z", "triangle-bottom": "M100 900h1000q41 0 49.5 -21t-20.5 -50l-494 -494q-14 -14 -35 -14t-35 14l-494 494q-29 29 -20.5 50t49.5 21z", "triangle-top": "M635 865l494 -494q29 -29 20.5 -50t-49.5 -21h-1000q-41 0 -49.5 21t20.5 50l494 494q14 14 35 14t35 -14z", plus: "M450 1100h200q21 0 35.5 -14.5t14.5 -35.5v-350h350q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-350v-350q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5v350h-350q-21 0 -35.5 14.5t-14.5 35.5v200q0 21 14.5 35.5t35.5 14.5 h350v350q0 21 14.5 35.5t35.5 14.5z" };

    function get_icon_svg(e, t, n, a) {
        var i = "";
        void 0 === t && (t = "1.3em"), void 0 === n && (n = "1.2em"), void 0 === a && (a = "currentColor");
        var o = !1;
        try { i = list_icon[e] } catch (e) { console.error("Parsing error:", e), o = !0 }
        if (o) return "";
        a = "<svg width='" + t + "' height='" + n + "' viewBox='0 0 1300 1200'><g transform='translate(30,1200) scale(1, -1)'><path  fill='" + a + "' d='";
        return a += i, a += "'></path></g></svg>"
    }

    function inputdlg(e, t, n, a) {
        var i = setactiveModal("inputdlg.html", n);
        null != i && (n = i.element.getElementsByClassName("modal-title")[0], i = i.element.getElementsByClassName("modal-text")[0], n.innerHTML = e, i.innerHTML = t, id("inputldg_text").value = void 0 !== a ? a : "", showModal())
    }

    function closeInputModal(e) {
        var t = "";
        closeModal(t = "ok" == e ? id("inputldg_text").value.trim() : t)
    }

    function store_localdata(e, t) { if ("undefined" == typeof localStorage) return !1; try { localStorage.setItem(e, t) } catch (e) { return !1 } return !0 }

    function get_localdata(e) { if ("undefined" == typeof localStorage) return ""; var t = ""; try { t = localStorage.getItem(e) } catch (e) { t = "" } return t }

    function delete_localdata(e) { if ("undefined" != typeof localStorage) try { window.localStorage.removeItem(e) } catch (e) {} }

    function logindlg(e, t) {
        var n = !1;
        null != setactiveModal("logindlg.html", e) && (id("login_title").innerHTML = translate_text_item("Identification requested"), displayNone("login_loader"), displayBlock("login_content"), (n = void 0 !== t ? t : n) ? SendGetHttp("/login", checkloginsuccess) : showModal())
    }

    function checkloginsuccess(e) {
        e = JSON.parse(e);
        void 0 !== e.authentication_lvl && "guest" != e.authentication_lvl ? (void 0 !== e.authentication_lvl && (id("current_auth_level").innerHTML = "(" + translate_text_item(e.authentication_lvl) + ")"), void 0 !== e.user && (id("current_ID").innerHTML = e.user), closeModal("cancel")) : showModal()
    }

    function login_id_OnKeyUp(e) { 13 == e.keyCode && id("login_password_text").focus() }

    function login_password_OnKeyUp(e) { 13 == e.keyCode && id("login_submit_btn").click() }

    function loginfailed(e, t) {
        var n = JSON.parse(t);
        void 0 !== n.status ? id("login_title").innerHTML = translate_text_item(n.status) : id("login_title").innerHTML = translate_text_item("Identification invalid!"), console.log("Error " + e + " : " + t), displayBlock("login_content"), displayNone("login_loader"), id("current_ID").innerHTML = translate_text_item("guest"), displayNone("logout_menu"), displayNone("logout_menu_divider"), displayNone("password_menu")
    }

    function loginsuccess(e) {
        e = JSON.parse(e);
        void 0 !== e.authentication_lvl && (id("current_auth_level").innerHTML = "(" + translate_text_item(e.authentication_lvl) + ")"), displayNone("login_loader"), displayBlock("logout_menu"), displayBlock("logout_menu_divider"), displayBlock("password_menu"), closeModal("Connection successful")
    }

    function SubmitLogin() {
        var e = id("login_user_text").value.trim(),
            t = id("login_password_text").value.trim(),
            t = "/login?USER=" + encodeURIComponent(e) + "&PASSWORD=" + encodeURIComponent(t) + "&SUBMIT=yes";
        id("current_ID").innerHTML = e, id("current_auth_level").innerHTML = "", displayNone("login_content"), displayBlock("login_loader"), SendGetHttp(t, loginsuccess, loginfailed)
    }

    function GetIdentificationStatus() { SendGetHttp("/login", GetIdentificationStatusSuccess) }

    function GetIdentificationStatusSuccess(e) {
        e = JSON.parse(e);
        void 0 !== e.authentication_lvl && "guest" == e.authentication_lvl && (id("current_ID").innerHTML = translate_text_item("guest"), id("current_auth_level").innerHTML = "")
    }

    function DisconnectionSuccess(e) { id("current_ID").innerHTML = translate_text_item("guest"), id("current_auth_level").innerHTML = "", displayNone("logout_menu"), displayNone("logout_menu_divider"), displayNone("password_menu") }

    function DisconnectionFailed(e, t) { id("current_ID").innerHTML = translate_text_item("guest"), id("current_auth_level").innerHTML = "", displayNone("logout_menu"), displayNone("logout_menu_divider"), displayNone("password_menu"), console.log("Error " + e + " : " + t) }

    function DisconnectLogin(e) { "yes" == e && SendGetHttp("/login?DISCONNECT=yes", DisconnectionSuccess, DisconnectionFailed) }
    var macrodlg_macrolist = [];

    function showmacrodlg(e) { null != setactiveModal("macrodlg.html", e) && (build_dlg_macrolist_ui(), displayNone("macrodlg_upload_msg"), showModal()) }

    function build_color_selection(e) {
        var t = "",
            n = 3 < e ? "up" : "down";
        return t += "<div class='dropdownselect'  id='macro_color_line" + e + "'>", t += "<button class='btn " + macrodlg_macrolist[e].class + "' onclick='showhide_drop_menu(event)'>&nbsp;", t += "<svg width='0.8em' height='0.8em' viewBox='0 0 1300 1200' style='pointer-events:none'>", t += "<g transform='translate(50,1200) scale(1, -1)'>", t += "<path  fill='currentColor' d='M100 900h1000q41 0 49.5 -21t-20.5 -50l-494 -494q-14 -14 -35 -14t-35 14l-494 494q-29 29 -20.5 50t49.5 21z'></path>", t += "</g>", t += "</svg>", t += "</button>", t += "<div class='dropmenu-content dropmenu-content-" + n + "' style='min-width:auto; padding-left: 4px;padding-right: 4px;'>", t += "<button class='btn btn-default' onclick='macro_select_color(event, \"default\" ," + e + ")'>&nbsp;</button>", t += "<button class='btn btn-primary' onclick='macro_select_color(event, \"primary\" ," + e + ")'>&nbsp;</button>", t += "<button class='btn btn-info' onclick='macro_select_color(event, \"info\" ," + e + ")'>&nbsp;</button>", t += "<button class='btn btn-warning' onclick='macro_select_color(event, \"warning\" ," + e + ")'>&nbsp;</button>", t += "<button class='btn btn-danger'  onclick='macro_select_color(event, \"danger\" ," + e + ")'>&nbsp;</button>", t += "</div>", t += "</div>"
    }

    function build_target_selection(e) {
        var t = "",
            n = 3 < e ? "up" : "down";
        return t += "<div class='dropdownselect'  id='macro_target_line" + e + "'>", t += "<button class='btn btn-default' style='min-width:5em;' onclick='showhide_drop_menu(event)'><span>" + macrodlg_macrolist[e].target + "</span>", t += "<svg width='0.8em' height='0.8em' viewBox='0 0 1300 1200' style='pointer-events:none'>", t += "<g transform='translate(50,1200) scale(1, -1)'>", t += "<path  fill='currentColor' d='M100 900h1000q41 0 49.5 -21t-20.5 -50l-494 -494q-14 -14 -35 -14t-35 14l-494 494q-29 29 -20.5 50t49.5 21z'></path>", t += "</g>", t += "</svg>", t += "</button>", t += "<div class='dropmenu-content dropmenu-content-" + n + "' style='min-width:auto'>", t += '<a href=# onclick=\'macro_select_target(event, "ESP" ,' + e + ")'>ESP</a>", t += '<a href=# onclick=\'macro_select_target(event, "SD" ,' + e + ")'>SD</a>", t += '<a href=# onclick=\'macro_select_target(event, "URI" ,' + e + ")'>URI</a>", t += "</div>", t += "</div>"
    }

    function build_glyph_selection(e) {
        var t, n = "",
            a = macrodlg_macrolist[e],
            i = 3 < e ? "up" : "down";
        for (t in n += "<div class='dropdownselect'  id='macro_glyph_line" + e + "'>", n += "<button class='btn " + a.class + "' onclick='showhide_drop_menu(event)'><span>" + get_icon_svg(a.glyph) + "</span>&nbsp;", n += "<svg width='0.8em' height='0.8em' viewBox='0 0 1300 1200' style='pointer-events:none'>", n += "<g transform='translate(50,1200) scale(1, -1)'>", n += "<path  fill='currentColor' d='M100 900h1000q41 0 49.5 -21t-20.5 -50l-494 -494q-14 -14 -35 -14t-35 14l-494 494q-29 29 -20.5 50t49.5 21z'></path>", n += "</g>", n += "</svg>", n += "</button>", n += "<div class='dropmenu-content  dropmenu-content-" + i + "' style='min-width:30em'>", list_icon) "plus" != t && (n += "<button class='btn btn-default btn-xs' onclick='macro_select_glyph(event, \"" + t + '" ,' + e + ")'><span>" + get_icon_svg(t) + "</span>", n += "</button>");
        return n += "</div>", n += "</div>"
    }

    function build_filename_selection(e) {
        var t = "",
            n = macrodlg_macrolist[e];
        return t += "<span id='macro_filename_input_line_" + e + "' class='form-group ", 0 == n.filename.length && (t += "has-error has-feedback"), t += "'>", t += "<input type='text' id='macro_filename_line_" + e + "' style='width:9em' class='form-control' onkeyup='macro_filename_OnKeyUp(this," + e + ")'  onchange='on_macro_filename(this," + e + ")' value='" + n.filename + "'  aria-describedby='inputStatus_line" + e + "'>", t += "<span id='icon_macro_status_line_" + e + "' style='color:#a94442; position:absolute;bottom:4px;left:7.5em;", 0 < n.filename.length && (t += "display:none"), t += "'>" + get_icon_svg("remove") + "</span>", t += "</input></span>"
    }

    function build_dlg_macrolist_line(e) {
        var t = "",
            n = macrodlg_macrolist[e];
        t += "<td style='vertical-align:middle'>", t += "<button onclick='macro_reset_button(" + e + ")'  class='btn btn-xs ", "" == n.class ? t += "btn-default'  style='padding-top: 3px;padding-left: 4px;padding-right: 2px;padding-bottom: 0px;' >" + get_icon_svg("plus") + " </button></td><td colspan='5'>" : (t += "btn-danger' style='padding-top: 3px;padding-left: 2px;padding-right: 3px;padding-bottom: 0px;' >" + get_icon_svg("trash") + "</button></td>", t += "<td style='vertical-align:middle'><input type='text' id='macro_name_line_" + e + "' style='width:4em' class='form-control' onchange='on_macro_name(this," + e + ")' value='", "&nbsp;" != n.name && (t += n.name), t += "'/></td>", t += "<td style='vertical-align:middle'>" + build_glyph_selection(e) + "</td>", t += "<td style='vertical-align:middle'>" + build_color_selection(e) + "</td>", t += "<td style='vertical-align:middle'>" + build_target_selection(e) + "</td>", t += "<td style='vertical-align:middle'>" + build_filename_selection(e) + "</td>"), t += "</td>", id("macro_line_" + e).innerHTML = t
    }

    function macro_filename_OnKeyUp(e, t) {
        var n = id("macro_filename_line_" + t),
            a = id("macro_filename_input_line_" + t);
        return 0 < n.value.trim().length ? (a.classList.contains("has-feedback") && a.classList.remove("has-feedback"), a.classList.contains("has-error") && a.classList.remove("has-error"), displayNone("icon_macro_status_line_" + t)) : (displayBlock("icon_macro_status_line_" + t), a.classList.contains("has-error") || a.classList.add("has-error"), a.classList.contains("has-feedback") || a.classList.add("has-feedback")), !0
    }

    function on_macro_filename(e, t) {
        var n = macrodlg_macrolist[t],
            a = e.value.trim();
        n.filename = e.value, 0 == a.length && alertdlg(translate_text_item("Out of range"), translate_text_item("File name cannot be empty!")), build_dlg_macrolist_line(t)
    }

    function on_macro_name(e, t) {
        t = macrodlg_macrolist[t];
        0 < e.value.trim().length ? t.name = e.value : t.name = "&nbsp;"
    }

    function build_dlg_macrolist_ui() {
        var e = "";
        macrodlg_macrolist = [];
        for (var t = 0; t < 9; t++) {
            var n = { name: control_macrolist[t].name, glyph: control_macrolist[t].glyph, filename: control_macrolist[t].filename, target: control_macrolist[t].target, class: control_macrolist[t].class, index: control_macrolist[t].index };
            macrodlg_macrolist.push(n), e += "<tr style='vertical-align:middle' id='macro_line_" + t + "'>", e += "</tr>"
        }
        id("dlg_macro_list").innerHTML = e;
        for (t = 0; t < 9; t++) build_dlg_macrolist_line(t)
    }

    function macro_reset_button(e) { var t = macrodlg_macrolist[e]; "" == t.class ? (t.name = "M" + (1 + t.index), t.glyph = "star", t.filename = "/macro" + (1 + t.index) + ".g", t.target = "ESP", t.class = "btn-default") : (t.name = "", t.glyph = "", t.filename = "", t.target = "", t.class = ""), build_dlg_macrolist_line(e) }

    function macro_select_color(e, t, n) {
        var a = macrodlg_macrolist[n];
        hide_drop_menu(e), a.class = "btn btn-" + t, build_dlg_macrolist_line(n)
    }

    function macro_select_target(e, t, n) {
        var a = macrodlg_macrolist[n];
        hide_drop_menu(e), a.target = t, build_dlg_macrolist_line(n)
    }

    function macro_select_glyph(e, t, n) {
        var a = macrodlg_macrolist[n];
        hide_drop_menu(e), a.glyph = t, build_dlg_macrolist_line(n)
    }

    function closeMacroDialog() {
        for (var e = !1, t = 0; t < 9; t++) macrodlg_macrolist[t].filename === control_macrolist[t].filename && macrodlg_macrolist[t].name === control_macrolist[t].name && macrodlg_macrolist[t].glyph === control_macrolist[t].glyph && macrodlg_macrolist[t].class === control_macrolist[t].class && macrodlg_macrolist[t].target === control_macrolist[t].target || (e = !0);
        e ? confirmdlg(translate_text_item("Data mofified"), translate_text_item("Do you want to save?"), process_macroCloseDialog) : closeModal("cancel")
    }

    function process_macroCloseDialog(e) { "no" == e ? closeModal("cancel") : SaveNewMacroList() }

    function SaveNewMacroList() {
        if (http_communication_locked) alertdlg(translate_text_item("Busy..."), translate_text_item("Communications are currently locked, please wait and retry."));
        else {
            for (var e = 0; e < 9; e++)
                if (0 == macrodlg_macrolist[e].filename.length && "" != macrodlg_macrolist[e].class) return void alertdlg(translate_text_item("Out of range"), translate_text_item("File name cannot be empty!"));
            var t, n = new Blob([JSON.stringify(macrodlg_macrolist, null, " ")], { type: "application/json" });
            browser_is("IE") || browser_is("Edge") ? ((t = n).name = "/macrocfg.json", t.lastModifiedDate = new Date) : t = new File([n], "/macrocfg.json");
            n = new FormData;
            n.append("path", "/"), n.append("myfile[]", t, "/macrocfg.json"), SendFileHttp("/files", n, macrodlgUploadProgressDisplay, macroUploadsuccess, macroUploadfailed)
        }
    }

    function macrodlgUploadProgressDisplay(e) { e.lengthComputable && (e = e.loaded / e.total * 100, id("macrodlg_prg").value = e, id("macrodlg_upload_percent").innerHTML = e.toFixed(0), displayBlock("macrodlg_upload_msg")) }

    function macroUploadsuccess(e) {
        control_macrolist = [];
        for (var t = 0; t < 9; t++) {
            var n = 0 != macrodlg_macrolist.length ? { name: macrodlg_macrolist[t].name, glyph: macrodlg_macrolist[t].glyph, filename: macrodlg_macrolist[t].filename, target: macrodlg_macrolist[t].target, class: macrodlg_macrolist[t].class, index: macrodlg_macrolist[t].index } : { name: "", glyph: "", filename: "", target: "", class: "", index: t };
            control_macrolist.push(n)
        }
        displayNone("macrodlg_upload_msg"), closeModal("ok")
    }

    function macroUploadfailed(e, t) { alertdlg(translate_text_item("Error"), translate_text_item("Save macro list failed!")), displayNone("macrodlg_upload_msg") }
    var listmodal = [];

    function setactiveModal(e, t) { if (void 0 === id(e)) return console.log("Error: no " + e), null; var n = new Object; return n.element = id(e), n.id = listmodal.length, n.name = e, n.closefn = void 0 !== t ? t : myfnclose, listmodal.push(n), listmodal[listmodal.length - 1] }

    function getactiveModal() { return 0 < listmodal.length ? listmodal[listmodal.length - 1] : null }

    function showModal() { getactiveModal().element.style.display = "block" }

    function closeModal(e) {
        var t, n = getactiveModal();
        null != n && (n.element.style.display = "none", t = n.closefn, listmodal.pop(), delete n, n = getactiveModal(), t(e))
    }

    function myfnclose(e) {}
    var numpad = {
        hwrap: null,
        hpad: null,
        hdisplay: null,
        hbwrap: null,
        hbuttons: {},
        init: function() {
            numpad.hwrap = document.createElement("div"), numpad.hwrap.id = "numWrap", numpad.hpad = document.createElement("div"), numpad.hpad.id = "numPad", numpad.hwrap.appendChild(numpad.hpad), numpad.hpad.tabindex = "0", numpad.hpad.contentEditable = !1, numpad.hpad.addEventListener("keydown", numpad.keypr), numpad.hdisplay = document.createElement("input"), numpad.hdisplay.id = "numDisplay", numpad.hdisplay.type = "text", numpad.hdisplay.disabled = !0, numpad.hdisplay.value = "0", numpad.hpad.appendChild(numpad.hdisplay), numpad.hbwrap = document.createElement("div"), numpad.hbwrap.id = "numBWrap", numpad.hpad.appendChild(numpad.hbwrap);

            function e(e, t, n) {
                var a = document.createElement("div");
                a.innerHTML = e, a.classList.add(t), a.addEventListener("click", n), numpad.hbwrap.appendChild(a), numpad.hbuttons[e] = a
            }

            function t() { e("", "spacer", null) }
            for (var n = 7; n <= 9; n++) e(n, "num", numpad.digit);
            e("&#10502;", "del", numpad.delete), t(), e("Goto", "goto", numpad.gotoCoordinate);
            for (n = 4; n <= 6; n++) e(n, "num", numpad.digit);
            e("C", "clr", numpad.reset), t(), t();
            for (n = 1; n <= 3; n++) e(n, "num", numpad.digit);
            e("+-", "num", numpad.toggleSign), e("Set", "set", numpad.setCoordinate), e(0, "zero", numpad.digit), e(".", "dot", numpad.dot), e("Get", "get", numpad.recall), e("Cancel", "cxwide", numpad.hide), document.body.appendChild(numpad.hwrap)
        },
        nowTarget: null,
        nowMax: 0,
        keypr: function(e) {
            switch (e.preventDefault(), e.key) {
                case "Escape":
                case "q":
                    numpad.hide();
                    break;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    numpad.digitv(e.key);
                    break;
                case ".":
                    numpad.dot();
                    break;
                case "Backspace":
                case "Del":
                    numpad.delete();
                    break;
                case "x":
                case "X":
                    numpad.reset();
                    break;
                case "c":
                case "C":
                    numpad.reset();
                    break;
                case "g":
                case "G":
                    numpad.recall();
                    break;
                case "s":
                case "S":
                case "Enter":
                    numpad.setCoordinate()
            }
        },
        digitv: function(e) {
            var t = numpad.hdisplay.value;
            t.length < numpad.nowMax && ("0" == t ? numpad.hdisplay.value = e : numpad.hdisplay.value += e)
        },
        digit: function() { numpad.digitv(this.innerHTML) },
        toggleSign: function() { numpad.hdisplay.value = -numpad.hdisplay.value },
        dot: function() {-1 == numpad.hdisplay.value.indexOf(".") && ("0" == numpad.hdisplay.value ? numpad.hdisplay.value = "0." : numpad.hdisplay.value += ".") },
        delete: function() {
            var e = numpad.hdisplay.value.length;
            numpad.hdisplay.value = 1 == e ? 0 : numpad.hdisplay.value.substring(0, e - 1)
        },
        reset: function() { numpad.hdisplay.value = "0" },
        recall: function() { numpad.hdisplay.value = numpad.nowTarget.textContent },
        setCoordinate: function() { numpad.nowTarget.textContent = numpad.hdisplay.value, setAxisByValue(numpad.nowTarget.dataset.axis, numpad.hdisplay.value), numpad.hide() },
        gotoCoordinate: function() { numpad.nowTarget.textContent = numpad.hdisplay.value, goAxisByValue(numpad.nowTarget.dataset.axis, numpad.hdisplay.value), numpad.hide() },
        attach: function(e) {
            void 0 === e.max && (e.max = 255), void 0 === e.decimal && (e.decimal = !0);
            var t = id(e.target);
            t.readOnly = !0, t.dataset.max = e.max, t.dataset.decimal = e.decimal, t.dataset.axis = e.axis, t.dataset.elementName = e.target, t.addEventListener("click", numpad.show)
        },
        show: function() {
            var e = "";
            numpad.hdisplay.value = e = "" == e ? "0" : e, numpad.nowMax = this.dataset.max, "true" == this.dataset.decimal ? numpad.hbwrap.classList.remove("noDec") : numpad.hbwrap.classList.add("noDec"), numpad.nowTarget = this, numpad.hwrap.classList.add("open")
        },
        hide: function() { numpad.hwrap.classList.remove("open") }
    };

    function changepassworddlg() { null != setactiveModal("passworddlg.html") && (displayNone("password_loader"), displayBlock("change_password_content"), displayNone("change_password_btn"), id("password_content").innerHTML = "", id("password_password_text").innerHTML = "", id("password_password_text1").innerHTML = "", id("password_password_text2").innerHTML = "", showModal()) }

    function checkpassword() {
        id("password_password_text").value.trim();
        var e = id("password_password_text1").value.trim(),
            t = id("password_password_text2").value.trim();
        id("password_content").innerHTML = "", displayNone("change_password_btn"), e != t ? id("password_content").innerHTML = translate_text_item("Passwords do not matches!") : e.length < 1 || 16 < e.length || -1 < e.indexOf(" ") ? id("password_content").innerHTML = translate_text_item("Password must be >1 and <16 without space!") : displayBlock("change_password_btn")
    }

    function ChangePasswordfailed(e, t) {
        var n = JSON.parse(t);
        void 0 !== n.status && (id("password_content").innerHTML = translate_text_item(n.status)), console.log("Error " + e + " : " + t), displayNone("password_loader"), displayBlock("change_password_content")
    }

    function ChangePasswordsuccess(e) { displayNone("password_loader"), closeModal("Connection successful") }

    function SubmitChangePassword() {
        var e = id("current_ID").innerHTML.trim(),
            t = id("password_password_text").value.trim(),
            n = id("password_password_text1").value.trim(),
            n = "/login?USER=" + encodeURIComponent(e) + "&PASSWORD=" + encodeURIComponent(t) + "&NEWPASSWORD=" + encodeURIComponent(n) + "&SUBMIT=yes";
        displayBlock("password_loader"), displayNone("change_password_content"), SendGetHttp(n, ChangePasswordsuccess, ChangePasswordfailed)
    }
    window.addEventListener("DOMContentLoaded", numpad.init);
    var preferenceslist = [],
        language_save = language,
        default_preferenceslist = [],
        defaultpreferenceslist = '[{                                            "language":"en",                                            "enable_lock_UI":"false",                                            "enable_ping":"true",                                            "enable_DHT":"false",                                            "enable_camera":"false",                                            "auto_load_camera":"false",                                            "camera_address":"",                                            "enable_redundant":"false",                                            "enable_probe":"false",                                            "enable_control_panel":"true",                                            "enable_grbl_panel":"false",                                            "autoreport_interval":"500",                                            "interval_positions":"3",                                            "interval_status":"3",                                            "xy_feedrate":"1000",                                            "z_feedrate":"100",                                            "a_feedrate":"100",                                            "b_feedrate":"100",                                            "c_feedrate":"100",                                            "e_feedrate":"400",                                            "e_distance":"5",                                            "f_filters":"gco;gcode",                                            "enable_files_panel":"true",                                            "has_TFT_SD":"false",                                            "has_TFT_USB":"false",                                            "enable_commands_panel":"true",                                            "enable_autoscroll":"true",                                            "enable_verbose_mode":"true",                                            "enable_grbl_probe_panel":"false",                                            "probemaxtravel":"40",                                            "probefeedrate":"100",                                            "proberetract":"1.0",                                            "probetouchplatethickness":"0.5"                                            }]',
        preferences_file_name = "/preferences.json";

    function initpreferences() { defaultpreferenceslist = '[{                                            "language":"en",                                            "enable_lock_UI":"false",                                            "enable_ping":"true",                                            "enable_DHT":"false",                                            "enable_camera":"false",                                            "auto_load_camera":"false",                                            "camera_address":"",                                            "number_extruders":"1",                                            "is_mixed_extruder":"false",                                            "enable_redundant":"false",                                            "enable_probe":"false",                                            "enable_control_panel":"true",                                            "enable_grbl_panel":"true",                                            "autoreport_interval":"500",                                            "interval_positions":"3",                                            "interval_status":"3",                                            "xy_feedrate":"1000",                                            "z_feedrate":"100",                                            "a_feedrate":"100",                                            "b_feedrate":"100",                                            "c_feedrate":"100",                                            "e_feedrate":"400",                                            "e_distance":"5",                                            "enable_files_panel":"true",                                            "has_TFT_SD":"false",                                            "has_TFT_USB":"false",                                            "f_filters":"g;G;gco;GCO;gcode;GCODE;nc;NC;ngc;NCG;tap;TAP;txt;TXT",                                            "enable_commands_panel":"true",                                            "enable_autoscroll":"true",                                            "enable_verbose_mode":"true",                                            "enable_grbl_probe_panel":"false",                                            "probemaxtravel":"40",                                            "probefeedrate":"100",                                            "proberetract":"1.0",                                            "probetouchplatethickness":"0.5"                                            }]', displayNone("DHT_pref_panel"), displayBlock("grbl_pref_panel"), displayTable("has_tft_sd"), displayTable("has_tft_usb"), default_preferenceslist = JSON.parse(defaultpreferenceslist) }

    function getpreferenceslist() { preferenceslist = [], SendGetHttp(preferences_file_name, processPreferencesGetSuccess, processPreferencesGetFailed) }

    function prefs_toggledisplay(e, t) {
        switch (void 0 !== t && (id(e).checked = t), e) {
            case "show_files_panel":
                (id(e).checked ? displayBlock : displayNone)("files_preferences");
                break;
            case "show_grbl_panel":
                (id(e).checked ? displayBlock : displayNone)("grbl_preferences");
                break;
            case "show_camera_panel":
                (id(e).checked ? displayBlock : displayNone)("camera_preferences");
                break;
            case "show_control_panel":
                (id(e).checked ? displayBlock : displayNone)("control_preferences");
                break;
            case "show_commands_panel":
                (id(e).checked ? displayBlock : displayNone)("cmd_preferences");
                break;
            case "show_grbl_probe_tab":
                (id(e).checked ? displayBlock : displayNone)("grbl_probe_preferences")
        }
    }

    function processPreferencesGetSuccess(e) {-1 == e.indexOf("<HTML>") ? Preferences_build_list(e) : Preferences_build_list(defaultpreferenceslist) }

    function processPreferencesGetFailed(e, t) { console.log("Error " + e + " : " + t), Preferences_build_list(defaultpreferenceslist) }

    function Preferences_build_list(e) { preferenceslist = []; try { preferenceslist = 0 != e.length ? JSON.parse(e) : JSON.parse(defaultpreferenceslist) } catch (e) { console.error("Parsing error:", e), preferenceslist = JSON.parse(defaultpreferenceslist) } applypreferenceslist() }

    function applypreferenceslist() {
        var e;
        if (translate_text(preferenceslist[0].language), build_HTML_setting_list(current_setting_filter), void 0 !== id("camtab") && (e = !1, void 0 !== preferenceslist[0].enable_camera && "true" === preferenceslist[0].enable_camera ? (displayBlock("camtablink"), camera_GetAddress(), void 0 !== preferenceslist[0].auto_load_camera && "true" === preferenceslist[0].auto_load_camera && (id("camera_webaddress").value, camera_loadframe(), e = !0)) : (id("maintablink").click(), displayNone("camtablink")), e || (id("camera_frame").src = "", displayNone("camera_frame_display"), displayNone("camera_detach_button"))), "true" === preferenceslist[0].enable_grbl_probe_panel ? displayBlock("grblprobetablink") : (id("grblcontroltablink").click(), displayNone("grblprobetablink")), "true" === preferenceslist[0].enable_DHT ? (displayBlock("DHT_humidity"), displayBlock("DHT_temperature")) : (displayNone("DHT_humidity"), displayNone("DHT_temperature")), "true" === preferenceslist[0].enable_lock_UI ? (displayBlock("lock_ui_btn"), ontoggleLock(!0)) : (displayNone("lock_ui_btn"), ontoggleLock(!1)), "true" === preferenceslist[0].enable_ping ? ontogglePing(!0) : ontogglePing(!1), "true" === preferenceslist[0].enable_grbl_panel ? displayNone("grblPanel") : (displayNone("grblPanel"), reportNone(!1)), "true" === preferenceslist[0].enable_control_panel ? displayFlex("controlPanel") : (displayNone("controlPanel"), on_autocheck_position(!1)), "true" === preferenceslist[0].enable_verbose_mode ? (id("monitor_enable_verbose_mode").checked = !0, Monitor_check_verbose_mode()) : id("monitor_enable_verbose_mode").checked = !1, ("true" === preferenceslist[0].enable_files_panel ? displayFlex : displayNone)("filesPanel"), ("true" === preferenceslist[0].has_TFT_SD ? displayFlex : displayNone)("files_refresh_tft_sd_btn"), ("true" === preferenceslist[0].has_TFT_USB ? displayFlex : displayNone)("files_refresh_tft_usb_btn"), "true" === preferenceslist[0].has_TFT_SD || "true" === preferenceslist[0].has_TFT_USB ? (displayFlex("files_refresh_printer_sd_btn"), displayNone("files_refresh_btn")) : (displayNone("files_refresh_printer_sd_btn"), displayFlex("files_refresh_btn")), "true" === preferenceslist[0].enable_commands_panel ? (displayFlex("commandsPanel"), "true" === preferenceslist[0].enable_autoscroll ? (id("monitor_enable_autoscroll").checked = !0, Monitor_check_autoscroll()) : id("monitor_enable_autoscroll").checked = !1) : displayNone("commandsPanel"), id("autoReportInterval").value = parseInt(preferenceslist[0].autoreport_interval), id("posInterval_check").value = parseInt(preferenceslist[0].interval_positions), id("statusInterval_check").value = parseInt(preferenceslist[0].interval_status), id("control_xy_velocity").value = parseInt(preferenceslist[0].xy_feedrate), id("control_z_velocity").value = parseInt(preferenceslist[0].z_feedrate), 2 < grblaxis && (axis_Z_feedrate = parseInt(preferenceslist[0].z_feedrate)), 3 < grblaxis && (axis_A_feedrate = parseInt(preferenceslist[0].a_feedrate)), 4 < grblaxis && (axis_B_feedrate = parseInt(preferenceslist[0].b_feedrate)), 5 < grblaxis && (axis_C_feedrate = parseInt(preferenceslist[0].c_feedrate)), 3 < grblaxis) switch (id("control_select_axis").value) {
            case "Z":
                id("control_z_velocity").value = axis_Z_feedrate;
                break;
            case "A":
                id("control_z_velocity").value = axis_A_feedrate;
                break;
            case "B":
                id("control_z_velocity").value = axis_B_feedrate;
                break;
            case "C":
                id("control_z_velocity").value = axis_C_feedrate
        }
        id("probemaxtravel").value = parseFloat(preferenceslist[0].probemaxtravel), id("probefeedrate").value = parseInt(preferenceslist[0].probefeedrate), id("proberetract").value = parseFloat(preferenceslist[0].proberetract), id("probetouchplatethickness").value = parseFloat(preferenceslist[0].probetouchplatethickness), build_file_filter_list(preferenceslist[0].f_filters)
    }

    function showpreferencesdlg() { null != setactiveModal("preferencesdlg.html") && (language_save = language, build_dlg_preferences_list(), displayNone("preferencesdlg_upload_msg"), showModal()) }

    function build_dlg_preferences_list() {
        var e = "<table><tr><td>";
        e += get_icon_svg("flag") + "&nbsp;</td><td>", e += build_language_list("language_preferences"), e += "</td></tr></table>", id("preferences_langage_list").innerHTML = e, void 0 !== preferenceslist[0].enable_camera ? id("show_camera_panel").checked = "true" === preferenceslist[0].enable_camera : id("show_camera_panel").checked = !1, void 0 !== preferenceslist[0].auto_load_camera ? id("autoload_camera_panel").checked = "true" === preferenceslist[0].auto_load_camera : id("autoload_camera_panel").checked = !1, void 0 !== preferenceslist[0].camera_address ? id("preferences_camera_webaddress").value = decode_entitie(preferenceslist[0].camera_address) : id("preferences_camera_webaddress").value = "", void 0 !== preferenceslist[0].enable_DHT ? id("enable_DHT").checked = "true" === preferenceslist[0].enable_DHT : id("enable_DHT").checked = !1, void 0 !== preferenceslist[0].enable_lock_UI ? id("enable_lock_UI").checked = "true" === preferenceslist[0].enable_lock_UI : id("enable_lock_UI").checked = !1, void 0 !== preferenceslist[0].enable_ping ? id("enable_ping").checked = "true" === preferenceslist[0].enable_ping : id("enable_ping").checked = !1, void 0 !== preferenceslist[0].enable_grbl_panel ? id("show_grbl_panel").checked = "true" === preferenceslist[0].enable_grbl_panel : id("show_grbl_panel").checked = !1, void 0 !== preferenceslist[0].enable_grbl_probe_panel ? id("show_grbl_probe_tab").checked = "true" === preferenceslist[0].enable_grbl_probe_panel : id("show_grbl_probe_tab").checked = !1, void 0 !== preferenceslist[0].enable_control_panel ? id("show_control_panel").checked = "true" === preferenceslist[0].enable_control_panel : id("show_control_panel").checked = !1, void 0 !== preferenceslist[0].enable_files_panel ? id("show_files_panel").checked = "true" === preferenceslist[0].enable_files_panel : id("show_files_panel").checked = !1, void 0 !== preferenceslist[0].has_TFT_SD ? id("has_tft_sd").checked = "true" === preferenceslist[0].has_TFT_SD : id("has_tft_sd").checked = !1, void 0 !== preferenceslist[0].has_TFT_USB ? id("has_tft_usb").checked = "true" === preferenceslist[0].has_TFT_USB : id("has_tft_usb").checked = !1, void 0 !== preferenceslist[0].enable_commands_panel ? id("show_commands_panel").checked = "true" === preferenceslist[0].enable_commands_panel : id("show_commands_panel").checked = !1, void 0 !== preferenceslist[0].autoreport_interval ? id("preferences_autoReport_Interval").value = parseInt(preferenceslist[0].autoreport_interval) : id("preferences_autoReport_Interval").value = parseInt(default_preferenceslist[0].autoreport_interval), void 0 !== preferenceslist[0].interval_positions ? id("preferences_pos_Interval_check").value = parseInt(preferenceslist[0].interval_positions) : id("preferences_pos_Interval_check").value = parseInt(default_preferenceslist[0].interval_positions), void 0 !== preferenceslist[0].interval_status ? id("preferences_status_Interval_check").value = parseInt(preferenceslist[0].interval_status) : id("preferences_status_Interval_check").value = parseInt(default_preferenceslist[0].interval_status), void 0 !== preferenceslist[0].xy_feedrate ? id("preferences_control_xy_velocity").value = parseInt(preferenceslist[0].xy_feedrate) : id("preferences_control_xy_velocity").value = parseInt(default_preferenceslist[0].xy_feedrate), 2 < grblaxis && (void 0 !== preferenceslist[0].z_feedrate ? id("preferences_control_z_velocity").value = parseInt(preferenceslist[0].z_feedrate) : id("preferences_control_z_velocity").value = parseInt(default_preferenceslist[0].z_feedrate)), 3 < grblaxis && (void 0 !== preferenceslist[0].a_feedrate ? id("preferences_control_a_velocity").value = parseInt(preferenceslist[0].a_feedrate) : id("preferences_control_a_velocity").value = parseInt(default_preferenceslist[0].a_feedrate)), 4 < grblaxis && (void 0 !== preferenceslist[0].b_feedrate ? id("preferences_control_b_velocity").value = parseInt(preferenceslist[0].b_feedrate) : id("preferences_control_b_velocity").value = parseInt(default_preferenceslist[0].b_feedrate)), 5 < grblaxis && (void 0 !== preferenceslist[0].c_feedrate ? id("preferences_control_c_velocity").value = parseInt(preferenceslist[0].c_feedrate) : id("preferences_control_c_velocity").value = parseInt(default_preferenceslist[0].c_feedrate)), void 0 !== preferenceslist[0].probemaxtravel && 0 != preferenceslist[0].probemaxtravel.length ? id("preferences_probemaxtravel").value = parseFloat(preferenceslist[0].probemaxtravel) : id("preferences_probemaxtravel").value = parseFloat(default_preferenceslist[0].probemaxtravel), void 0 !== preferenceslist[0].probefeedrate && 0 != preferenceslist[0].probefeedrate.length ? id("preferences_probefeedrate").value = parseInt(preferenceslist[0].probefeedrate) : id("preferences_probefeedrate").value = parseInt(default_preferenceslist[0].probefeedrate), void 0 !== preferenceslist[0].proberetract && 0 != preferenceslist[0].proberetract.length ? id("preferences_proberetract").value = parseFloat(preferenceslist[0].proberetract) : id("preferences_proberetract").value = parseFloat(default_preferenceslist[0].proberetract), void 0 !== preferenceslist[0].probetouchplatethickness && 0 != preferenceslist[0].probetouchplatethickness.length ? id("preferences_probetouchplatethickness").value = parseFloat(preferenceslist[0].probetouchplatethickness) : id("preferences_probetouchplatethickness").value = parseFloat(default_preferenceslist[0].probetouchplatethickness), void 0 !== preferenceslist[0].enable_autoscroll ? id("preferences_autoscroll").checked = "true" === preferenceslist[0].enable_autoscroll : id("preferences_autoscroll").checked = !1, void 0 !== preferenceslist[0].enable_verbose_mode ? id("preferences_verbose_mode").checked = "true" === preferenceslist[0].enable_verbose_mode : id("preferences_verbose_mode").checked = !1, void 0 !== preferenceslist[0].f_filters ? (console.log("Use prefs filters"), id("preferences_filters").value = preferenceslist[0].f_filters) : (console.log("Use default filters"), id("preferences_filters").value = String(default_preferenceslist[0].f_filters)), prefs_toggledisplay("show_camera_panel"), prefs_toggledisplay("show_grbl_panel"), prefs_toggledisplay("show_control_panel"), prefs_toggledisplay("show_commands_panel"), prefs_toggledisplay("show_files_panel"), prefs_toggledisplay("show_grbl_probe_tab")
    }

    function closePreferencesDialog() {
        var e = !1;
        console.log("Call close preferences dialog");
        setactiveModal("preferencesdlg.html");
        closeModal("cancel");
        0 != preferenceslist[0].length && (void 0 === preferenceslist[0].language || void 0 === preferenceslist[0].enable_camera || void 0 === preferenceslist[0].auto_load_camera || void 0 === preferenceslist[0].camera_address || void 0 === preferenceslist[0].enable_DHT || void 0 === preferenceslist[0].enable_lock_UI || void 0 === preferenceslist[0].enable_ping || void 0 === preferenceslist[0].enable_redundant || void 0 === preferenceslist[0].enable_probe || void 0 === preferenceslist[0].xy_feedrate || void 0 === preferenceslist[0].z_feedrate || void 0 === preferenceslist[0].e_feedrate || void 0 === preferenceslist[0].e_distance || void 0 === preferenceslist[0].enable_control_panel || void 0 === preferenceslist[0].enable_grbl_panel || void 0 === preferenceslist[0].enable_grbl_probe_panel || void 0 === preferenceslist[0].probemaxtravel || void 0 === preferenceslist[0].probefeedrate || void 0 === preferenceslist[0].proberetract || void 0 === preferenceslist[0].probetouchplatethickness || void 0 === preferenceslist[0].enable_files_panel || void 0 === preferenceslist[0].has_TFT_SD || void 0 === preferenceslist[0].has_TFT_USB || void 0 === preferenceslist[0].autoreport_interval || void 0 === preferenceslist[0].interval_positions || void 0 === preferenceslist[0].interval_status || void 0 === preferenceslist[0].enable_autoscroll || void 0 === preferenceslist[0].enable_verbose_mode || void 0 === preferenceslist[0].enable_commands_panel ? e = !0 : (id("show_camera_panel").checked != ("true" === preferenceslist[0].enable_camera) && (e = !0), id("autoload_camera_panel").checked != ("true" === preferenceslist[0].auto_load_camera) && (e = !0), id("preferences_camera_webaddress").value != decode_entitie(preferenceslist[0].camera_address) && (e = !0), id("enable_DHT").checked != ("true" === preferenceslist[0].enable_DHT) && (e = !0), id("enable_lock_UI").checked != ("true" === preferenceslist[0].enable_lock_UI) && (e = !0), id("enable_ping").checked != ("true" === preferenceslist[0].enable_ping) && (e = !0), id("enable_probe_controls").checked != ("true" === preferenceslist[0].enable_probe) && (e = !0), id("show_control_panel").checked != ("true" === preferenceslist[0].enable_control_panel) && (e = !0), id("show_grbl_panel").checked != ("true" === preferenceslist[0].enable_grbl_panel) && (e = !0), id("show_grbl_probe_tab").checked != ("true" === preferenceslist[0].enable_grbl_probe_panel) && (e = !0), id("show_files_panel").checked != ("true" === preferenceslist[0].enable_files_panel) && (e = !0), id("has_tft_sd").checked != ("true" === preferenceslist[0].has_TFT_SD) && (e = !0), id("has_tft_usb").checked != ("true" === preferenceslist[0].has_TFT_USB) && (e = !0), id("show_commands_panel").checked != ("true" === preferenceslist[0].enable_commands_panel) && (e = !0), id("preferences_autoReport_Interval").value != parseInt(preferenceslist[0].autoReport_interval) && (e = !0), id("preferences_pos_Interval_check").value != parseInt(preferenceslist[0].interval_positions) && (e = !0), id("preferences_status_Interval_check").value != parseInt(preferenceslist[0].interval_status) && (e = !0), id("preferences_control_xy_velocity").value != parseInt(preferenceslist[0].xy_feedrate) && (e = !0), 2 < grblaxis && id("preferences_control_z_velocity").value != parseInt(preferenceslist[0].z_feedrate) && (e = !0), 3 < grblaxis && id("preferences_control_a_velocity").value != parseInt(preferenceslist[0].a_feedrate) && (e = !0), 4 < grblaxis && id("preferences_control_b_velocity").value != parseInt(preferenceslist[0].b_feedrate) && (e = !0), 5 < grblaxis && id("preferences_control_c_velocity").value != parseInt(preferenceslist[0].c_feedrate) && (e = !0)), id("preferences_autoscroll").checked != ("true" === preferenceslist[0].enable_autoscroll) && (e = !0), id("preferences_verbose_mode").checked != ("true" === preferenceslist[0].enable_verbose_mode) && (e = !0), id("preferences_filters").value != preferenceslist[0].f_filters && (e = !0), id("preferences_probemaxtravel").value != parseFloat(preferenceslist[0].probemaxtravel) && (e = !0), id("preferences_probefeedrate").value != parseInt(preferenceslist[0].probefeedrate) && (e = !0), id("preferences_proberetract").value != parseFloat(preferenceslist[0].proberetract) && (e = !0), id("preferences_probetouchplatethickness").value != parseFloat(preferenceslist[0].probetouchplatethickness) && (e = !0)), console.log("End of closePreferencesDialog()"), (e = language_save != language ? !0 : e) ? confirmdlg(translate_text_item("Data mofified"), translate_text_item("Do you want to save?"), process_preferencesCloseDialog) : closeModal("cancel")
    }

    function process_preferencesCloseDialog(e) { "no" == e ? (translate_text(language_save), closeModal("cancel")) : SavePreferences() }

    function SavePreferences(e) {
        if (http_communication_locked) alertdlg(translate_text_item("Busy..."), translate_text_item("Communications are currently locked, please wait and retry."));
        else {
            if (console.log("save prefs"), void 0 !== e && !e || void 0 === e) {
                if (!(Checkvalues("preferences_autoReport_Interval") && Checkvalues("preferences_pos_Interval_check") && Checkvalues("preferences_status_Interval_check") && Checkvalues("preferences_control_xy_velocity") && Checkvalues("preferences_filters") && Checkvalues("preferences_probemaxtravel") && Checkvalues("preferences_probefeedrate") && Checkvalues("preferences_proberetract") && Checkvalues("preferences_probetouchplatethickness"))) return;
                if (2 < grblaxis && !Checkvalues("preferences_control_z_velocity")) return;
                if (3 < grblaxis && !Checkvalues("preferences_control_a_velocity")) return;
                if (4 < grblaxis && !Checkvalues("preferences_control_b_velocity")) return;
                if (5 < grblaxis && !Checkvalues("preferences_control_c_velocity")) return;
                preferenceslist = [];
                var t = '[{"language":"' + language;
                t += '","enable_camera":"' + id("show_camera_panel").checked, t += '","auto_load_camera":"' + id("autoload_camera_panel").checked, t += '","camera_address":"' + HTMLEncode(id("preferences_camera_webaddress").value), t += '","enable_DHT":"' + id("enable_DHT").checked, t += '","enable_lock_UI":"' + id("enable_lock_UI").checked, t += '","enable_ping":"' + id("enable_ping").checked, t += '","enable_control_panel":"' + id("show_control_panel").checked, t += '","enable_grbl_probe_panel":"' + id("show_grbl_probe_tab").checked, t += '","enable_grbl_panel":"' + id("show_grbl_panel").checked, t += '","enable_files_panel":"' + id("show_files_panel").checked, t += '","has_TFT_SD":"' + id("has_tft_sd").checked, t += '","has_TFT_USB":"' + id("has_tft_usb").checked, t += '","probemaxtravel":"' + id("preferences_probemaxtravel").value, t += '","probefeedrate":"' + id("preferences_probefeedrate").value, t += '","proberetract":"' + id("preferences_proberetract").value, t += '","probetouchplatethickness":"' + id("preferences_probetouchplatethickness").value, t += '","autoreport_interval":"' + id("preferences_autoReport_Interval").value, t += '","interval_positions":"' + id("preferences_pos_Interval_check").value, t += '","interval_status":"' + id("preferences_status_Interval_check").value, t += '","xy_feedrate":"' + id("preferences_control_xy_velocity").value, 2 < grblaxis && (t += '","z_feedrate":"' + id("preferences_control_z_velocity").value), 3 < grblaxis && (t += '","a_feedrate":"' + id("preferences_control_a_velocity").value), 4 < grblaxis && (t += '","b_feedrate":"' + id("preferences_control_b_velocity").value), 5 < grblaxis && (t += '","c_feedrate":"' + id("preferences_control_c_velocity").value), t += '","f_filters":"' + id("preferences_filters").value, t += '","enable_autoscroll":"' + id("preferences_autoscroll").checked, t += '","enable_verbose_mode":"' + id("preferences_verbose_mode").checked, t += '","enable_commands_panel":"' + id("show_commands_panel").checked + '"}]', preferenceslist = JSON.parse(t)
            }
            var n, t = new Blob([JSON.stringify(preferenceslist, null, " ")], { type: "application/json" });
            browser_is("IE") || browser_is("Edge") ? ((n = t).name = preferences_file_name, n.lastModifiedDate = new Date) : n = new File([t], preferences_file_name);
            t = new FormData;
            t.append("path", "/"), t.append("myfile[]", n, preferences_file_name), void 0 !== e && e ? SendFileHttp("/files", t) : SendFileHttp("/files", t, preferencesdlgUploadProgressDisplay, preferencesUploadsuccess, preferencesUploadfailed)
        }
    }

    function preferencesdlgUploadProgressDisplay(e) { e.lengthComputable && (e = e.loaded / e.total * 100, id("preferencesdlg_prg").value = e, id("preferencesdlg_upload_percent").innerHTML = e.toFixed(0), displayBlock("preferencesdlg_upload_msg")) }

    function preferencesUploadsuccess(e) { displayNone("preferencesdlg_upload_msg"), applypreferenceslist(), closeModal("ok") }

    function preferencesUploadfailed(e, t) { alertdlg(translate_text_item("Error"), translate_text_item("Save preferences failed!")) }

    function Checkvalues(e) {
        var t = !0,
            n = 0;
        switch (e) {
            case "preferences_autoReport_Interval":
                n = parseInt(id(e).value), !isNaN(n) && 500 <= n && n <= 3e4 || (error_message = translate_text_item("Value of auto-report must be between 500ms and 30000ms !!"), t = !1);
                break;
            case "preferences_status_Interval_check":
            case "preferences_pos_Interval_check":
                n = parseInt(id(e).value), !isNaN(n) && 1 <= n && n <= 100 || (error_message = translate_text_item("Value of auto-check must be between 0s and 99s !!"), t = !1);
                break;
            case "preferences_control_xy_velocity":
                n = parseInt(id(e).value), !isNaN(n) && 1 <= n || (error_message = translate_text_item("XY Feedrate value must be at least 1 mm/min!"), t = !1);
                break;
            case "preferences_control_z_velocity":
                n = parseInt(id(e).value), !isNaN(n) && 1 <= n || (error_message = translate_text_item("Z Feedrate value must be at least 1 mm/min!"), t = !1);
                break;
            case "preferences_control_a_velocity":
            case "preferences_control_b_velocity":
            case "preferences_control_c_velocity":
                n = parseInt(id(e).value), !isNaN(n) && 1 <= n || (error_message = translate_text_item("Axis Feedrate value must be at least 1 mm/min!"), t = !1);
                break;
            case "preferences_probefeedrate":
                n = parseInt(id(e).value), !isNaN(n) && 1 <= n && n <= 9999 || (error_message = translate_text_item("Value of probe feedrate must be between 1 mm/min and 9999 mm/min !"), t = !1);
                break;
            case "preferences_probemaxtravel":
                n = parseInt(id(e).value), !isNaN(n) && 1 <= n && n <= 9999 || (error_message = translate_text_item("Value of maximum probe travel must be between 1 mm and 9999 mm !"), t = !1);
                break;
            case "preferences_proberetract":
                n = parseInt(id(e).value), !isNaN(n) && 0 <= n && n <= 9999 || (error_message = translate_text_item("Value of probe retract must be between 0 mm and 9999 mm !"), t = !1);
                break;
            case "preferences_probetouchplatethickness":
                n = parseInt(id(e).value), !isNaN(n) && 0 <= n && n <= 9999 || (error_message = translate_text_item("Value of probe touch plate thickness must be between 0 mm and 9999 mm !"), t = !1);
                break;
            case "preferences_filters":
                -1 == (n = id(e).value).indexOf(".") && -1 == n.indexOf("*") || (error_message = translate_text_item("Only alphanumeric chars separated by ; for extensions filters"), t = !1)
        }
        return t ? (id(e + "_group").classList.remove("has-feedback"), id(e + "_group").classList.remove("has-error"), id(e + "_icon").innerHTML = "") : (id(e + "_group").classList.add("has-error"), alertdlg(translate_text_item("Out of range"), error_message)), t
    }
    var grbl_processfn = null,
        grbl_errorfn = null;

    function noop() {}

    function SendPrinterCommand(e, t, n, a, i, o, r) {
        t = void 0 === t || t;
        0 != e.length && (t && Monitor_output_Update("[#]" + e + "\n"), void 0 !== n && null != n || (n = SendPrinterCommandSuccess), void 0 !== a && null != a || (a = SendPrinterCommandFailed), e.startsWith("[ESP") || (grbl_processfn = n, grbl_errorfn = a, a = n = noop), e = (e = encodeURI(e)).replace("#", "%23"), r && (e += "&" + r), SendGetHttp("/command?commandText=" + e, n, a, i, o))
    }

    function SendPrinterSilentCommand(e, t, n, a, i) { 0 != e.length && (void 0 !== t && null != t || (t = SendPrinterSilentCommandSuccess), void 0 !== n && null != n || (n = SendPrinterCommandFailed), SendGetHttp("/command_silent?commandText=" + (e = (e = encodeURI(e)).replace("#", "%23")), t, n, a, i)) }

    function SendPrinterSilentCommandSuccess(e) {}

    function SendPrinterCommandSuccess(e) {}

    function SendPrinterCommandFailed(e, t) { Monitor_output_Update(0 == e ? translate_text_item("Connection error") + "\n" : translate_text_item("Error : ") + e + " :" + decode_entitie(t) + "\n"), console.log("printer cmd Error " + e + " :" + decode_entitie(t)) }

    function restartdlg() { console.log("show restart"), null != setactiveModal("restartdlg.html") && (displayBlock("prgrestart"), id("restartmsg").innerHTML = translate_text_item("Restarting, please wait...."), showModal(), SendPrinterCommand("[ESP444]RESTART", !1, restart_esp_success, restart_esp_failed)) }

    function restart_esp_success(e) {
        var t, n = 0,
            a = id("prgrestart");
        http_communication_locked = !0, a.max = 10, t = setInterval(function() {
            last_ping = Date.now(), n += 1;
            var e = id("prgrestart");
            e.value = n, id("restartmsg").innerHTML = translate_text_item("Restarting, please wait....") + (e.max + 1 - n) + translate_text_item(" seconds"), n > e.max && (clearInterval(t), location.reload())
        }, 1e3)
    }

    function restart_esp_failed(e, t) { displayNone("prgrestart"), id("restartmsg").innerHTML = translate_text_item("Upload failed : ") + e + " :" + t, console.log("Error " + e + " : " + t), closeModal("Cancel") }
    var ssid_item_scanwifi = -1,
        ssid_subitem_scanwifi = -1;

    function scanwifidlg(e, t) { null != setactiveModal("scanwifidlg.html", scanwifidlg_close) && (ssid_item_scanwifi = e, ssid_subitem_scanwifi = t, showModal(), refresh_scanwifi()) }

    function refresh_scanwifi() { displayBlock("AP_scan_loader"), displayNone("AP_scan_list"), displayBlock("AP_scan_status"), id("AP_scan_status").innerHTML = translate_text_item("Scanning"), displayNone("refresh_scanwifi_btn"), SendGetHttp("/command?plain=" + encodeURIComponent("[ESP410]"), getscanWifiSuccess, getscanWififailed) }

    function process_scanWifi_answer(e) {
        var t = !0,
            n = "";
        try {
            var a = JSON.parse(e);
            if (void 0 === a.AP_LIST) t = !1;
            else {
                var i = a.AP_LIST;
                i.sort(function(e, t) { return parseInt(e.SIGNAL) < parseInt(t.SIGNAL) ? -1 : parseInt(e.SIGNAL) > parseInt(t.SIGNAL) ? 1 : 0 });
                for (var o = i.length - 1; 0 <= o; o--) n += "<tr>", n += "<td style='vertical-align:middle'>", n += i[o].SSID, n += "</td>", n += "<td style='text-align: center;vertical-align:middle;'>", n += i[o].SIGNAL, n += "%</td>", n += "<td style='vertical-align:middle'><center>", "1" == i[o].IS_PROTECTED && (n += get_icon_svg("lock")), n += "</></td>", n += "<td>", n += "<button class='btn btn-primary' onclick='select_ap_ssid(\"" + i[o].SSID.replace("'", "\\'").replace('"', '\\"') + "\");'>", n += get_icon_svg("ok"), n += "</button>", n += "</td>", n += "</tr>"
            }
        } catch (e) { console.error("Parsing error:", e), t = !1 }
        return id("AP_scan_data").innerHTML = n, t
    }

    function select_ap_ssid(e) {
        var t = id("setting_" + ssid_item_scanwifi + "_" + ssid_subitem_scanwifi).value;
        id("setting_" + ssid_item_scanwifi + "_" + ssid_subitem_scanwifi).value = e, id("setting_" + ssid_item_scanwifi + "_" + ssid_subitem_scanwifi).focus(), t != e && setsettingchanged(ssid_item_scanwifi, ssid_subitem_scanwifi), closeModal("Ok")
    }

    function getscanWifiSuccess(e) { process_scanWifi_answer(e) ? (displayNone("AP_scan_loader"), displayBlock("AP_scan_list"), displayNone("AP_scan_status"), displayBlock("refresh_scanwifi_btn")) : getscanWififailed(406, translate_text_item("Wrong data")) }

    function getscanWififailed(e, t) { console.log("Error " + e + " :" + t), displayNone("AP_scan_loader"), displayBlock("AP_scan_status"), id("AP_scan_status").innerHTML = translate_text_item("Failed:") + e + " " + t, displayBlock("refresh_scanwifi_btn") }

    function scanwifidlg_close(e) {}
    var scl = [],
        setting_error_msg = "",
        setting_lasti = -1,
        setting_lastj = -1,
        current_setting_filter = "nvs",
        setup_is_done = !1,
        do_not_build_settings = !1;

    function refreshSettings(e) { http_communication_locked ? id("config_status").innerHTML = translate_text_item("Communication locked by another process, retry later.") : (do_not_build_settings = void 0 !== e && !e, displayBlock("settings_loader"), displayNone("settings_list_content"), displayNone("settings_status"), displayNone("settings_refresh_btn"), scl = [], SendGetHttp("/command?plain=" + encodeURIComponent("[ESP400]"), getESPsettingsSuccess, getESPsettingsfailed)) }

    function defval(e) { return scl[e].defaultvalue }

    function build_select_flag_for_setting_list(e, t) {
        var n = "";
        n += "<select class='form-control' id='setting_" + e + "_" + t + "' onchange='setting_checkchange(" + e + "," + t + ")' >";
        n += "<option value='1'";
        var a = scl[e].defaultvalue;
        (a |= getFlag(e, t)) == defval(e) && (n += " selected "), n += ">", n += translate_text_item("Disable", !0), n += "</option>\n", n += "<option value='0'";
        a = defval(e);
        return (a &= ~getFlag(e, t)) == defval(e) && (n += " selected "), n += ">", n += translate_text_item("Enable", !0), n += "</option>\n", n += "</select>\n"
    }

    function build_select_for_setting_list(e, t) { for (var n = "<select class='form-control input-min wauto' id='setting_" + e + "_" + t + "' onchange='setting_checkchange(" + e + "," + t + ")' >", a = 0; a < scl[e].Options.length; a++) n += "<option value='" + scl[e].Options[a].id + "'", scl[e].Options[a].id == defval(e) && (n += " selected "), n += ">", n += translate_text_item(scl[e].Options[a].display, !0), browser_is("MacOSX") && (n += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"), n += "</option>\n"; return n += "</select>\n" }

    function update_UI_setting() {
        for (var e = 0; e < scl.length; e++) switch (scl[e].pos) {
            case "850":
                direct_sd = 1 == defval(e), update_UI_firmware_target(), init_files_panel(!1);
                init_rss_panel(!1);
                break;
            case "130":
                Set_page_title(defval(e))
        }
    }

    function build_control_from_index(e, t) { var n = "<table>"; if (e < scl.length) { nbsub = "F" == scl[e].type ? scl[e].Options.length : 1; for (var a = 0; a < nbsub; a++) 0 < a && (n += "<tr><td style='height:10px;'></td></tr>"), n += "<tr><td style='vertical-align: middle;'>", "F" == scl[e].type && (n += translate_text_item(scl[e].Options[a].display, !0), n += "</td><td>&nbsp;</td><td>"), n += "<div id='status_setting_" + e + "_" + a + "' class='form-group has-feedback' style='margin: auto;'>", n += "<div class='item-flex-row'>", n += "<table><tr><td>", n += "<div class='input-group'>", n += "<div class='input-group-btn'>", n += "</div>", n += "<input class='hide_it'></input>", n += "</div>", n += "</td><td>", n += "<div class='input-group'>", n += "<span class='input-group-addon hide_it' ></span>", "F" == scl[e].type ? n += build_select_flag_for_setting_list(e, a) : 0 < scl[e].Options.length ? n += build_select_for_setting_list(e, a) : (input_type = defval(e).startsWith("******") ? "password" : "text", n += "<form><input id='setting_" + e + "_" + a + "' type='" + input_type + "' class='form-control input-min'  value='" + defval(e) + "' onkeyup='setting_checkchange(" + e + "," + a + ")' ></form>"), n += "<span id='icon_setting_" + e + "_" + a + "'class='form-control-feedback ico_feedback'></span>", n += "<span class='input-group-addon hide_it' ></span>", n += "</div>", n += "</td></tr></table>", n += "<div class='input-group'>", n += "<input class='hide_it'></input>", n += "<div class='input-group-btn'>", n += "<button  id='btn_setting_" + e + "_" + a + "' class='btn btn-default' onclick='settingsetvalue(" + e + "," + a + ");", void 0 !== t && (n += t + "(" + e + ");"), n += "' translate english_content='Set' >" + translate_text_item("Set") + "</button>", scl[e].pos == EP_STA_SSID && (n += "<button class='btn btn-default btn-svg' onclick='scanwifidlg(\"" + e + '","' + a + "\")'>", n += get_icon_svg("search"), n += "</button>"), n += "</div>", n += "</div>", n += "</div>", n += "</div>", n += "</td></tr>" } return n += "</table>" }

    function get_index_from_eeprom_pos(e) {
        for (var t = 0; t < scl.length; t++)
            if (e == scl[t].pos) return t;
        return -1
    }

    function build_control_from_pos(e, t) { return build_control_from_index(get_index_from_eeprom_pos(e), t) }

    function build_HTML_setting_list(e) {
        if (!do_not_build_settings) {
            var t = "";
            id((current_setting_filter = e) + "_setting_filter").checked = !0;
            for (var n = 0; n < scl.length; n++) fname = scl[n].F.trim().toLowerCase(), "network" != fname && fname != e && "all" != e || (t += "<tr>", t += "<td style='vertical-align:middle'>", t += translate_text_item(scl[n].label, !0), t += "</td>", t += "<td style='vertical-align:middle'>", t += "<table><tr><td>" + build_control_from_index(n) + "</td></tr></table>", t += "</td>", t += "</tr>\n");
            id("settings_list_data").innerHTML = t
        }
    }

    function setting_check_value(e, t) {
        var n = !0,
            a = scl[t];
        if ("F" == a.type) return n;
        if (0 < a.Options.length) {
            for (var i = !1, o = 0; o < a.Options.length; o++) a.Options[o].id == e && (i = !0);
            (n = i) || (setting_error_msg = " in provided list")
        }
        return "B" == a.type || "I" == a.type ? (e.trim(), 0 == e.length && (n = !1), parseInt(a.min_val) > parseInt(e) && (n = !1), (n = parseInt(a.max_val) < parseInt(e) ? !1 : n) || (setting_error_msg = " between " + a.min_val + " and " + a.max_val), isNaN(e) && (n = !1)) : "S" == a.type ? (a.min_val > e.length && (n = !1), a.max_val < e.length && (n = !1), (n = "********" == e ? !1 : n) || (setting_error_msg = " between " + a.min_val + " char(s) and " + a.max_val + " char(s) long, and not '********'")) : "A" == a.type && (e.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/) || (n = !1, setting_error_msg = " a valid IP format (xxx.xxx.xxx.xxx)")), n
    }

    function process_settings_answer(e) {
        var t = !0;
        try {
            var n = JSON.parse(e);
            if (void 0 === n.EEPROM) t = !1, console.log("No EEPROM");
            else if (0 < n.EEPROM.length) {
                for (var a = 0, i = 0; i < n.EEPROM.length; i++) a = create_setting_entry(n.EEPROM[i], a);
                0 < a ? (setup_is_done && build_HTML_setting_list(current_setting_filter), update_UI_setting()) : t = !1
            } else t = !1
        } catch (e) { console.error("Parsing error:", e), t = !1 }
        return t
    }

    function create_setting_entry(e, t) {
        if (!is_setting_entry(e)) return t;
        var n, a = e.H,
            i = e.V,
            o = "[ESP401]P=" + e.P + " T=" + e.T + " V=",
            r = [];
        if (void 0 !== e.M ? n = e.M : "B" == e.T ? n = -127 : "S" == e.T ? n = 0 : "A" == e.T ? n = 7 : "I" == e.T && (n = 0), void 0 !== e.S ? u = e.S : "B" == e.T || "S" == e.T ? u = 255 : "A" == e.T ? u = 15 : "I" == e.T && (u = 2147483647), void 0 !== e.O)
            for (var s in e.O) {
                var l, c = e.O[s];
                for (l in c) {
                    var d = { id: c[l].trim(), display: l.trim() };
                    r.push(d)
                }
            }
        var i = i.trim(),
            u = { index: t, F: e.F, label: a, defaultvalue: i, cmd: o, Options: r, min_val: n, max_val: u, type: e.T, pos: e.P };
        return scl.push(u), ++t
    }

    function is_setting_entry(e) { return void 0 !== e.T && void 0 !== e.V && void 0 !== e.P && void 0 !== e.H }

    function getFlag(e, t) { return "F" != scl[e].type || scl[e].Options.length <= t ? -1 : parseInt(scl[e].Options[t].id) }

    function getFlag_description(e, t) { return "F" != scl[e].type || scl[e].Options.length <= t ? -1 : scl[e].Options[t].display }

    function setting(e, t) { return id("setting_" + e + "_" + t) }

    function setBtn(e, t, n) { id("btn_setting_" + e + "_" + t).className = "btn " + n }

    function setStatus(e, t, n) { id("status_setting_" + e + "_" + t).className = "form-group " + n }

    function setIcon(e, t, n) { id("icon_setting_" + e + "_" + t).className = "form-control-feedback " + n }

    function setIconHTML(e, t, n) { id("icon_setting_" + e + "_" + t).innerHTML = n }

    function setting_revert_to_default(e, t) {
        var n, a;
        void 0 === t && (t = 0), "F" == scl[e].type ? (n = getFlag(e, t), a = parseInt(defval(e)), (a |= n) == parseInt(defval(e)) ? setting(e, t).value = "1" : setting(e, t).value = "0") : setting(e, t).value = defval(e), setBtn(e, t, "btn-default"), setStatus(e, t, "form-group has-feedback"), setIconHTML(e, t, "")
    }

    function settingsetvalue(e, t) {
        var n;
        value = setting(e, t = void 0 === t ? 0 : t).value.trim(), "F" == scl[e].type && (n = defval(e), "1" == value ? n |= getFlag(e, t) : n &= ~getFlag(e, t), value = n), value != defval(e) && (setting_check_value(value, e) ? (n = scl[e].cmd + value, setting_lastj = t, scl[setting_lasti = e].defaultvalue = value, setBtn(e, t, "btn-success"), setIcon(e, t, "has-success ico_feedback"), setIconHTML(e, t, get_icon_svg("ok")), setStatus(e, t, "has-feedback has-success"), SendGetHttp("/command?plain=" + encodeURIComponent(n), setESPsettingsSuccess, setESPsettingsfailed)) : (setsettingerror(e), alertdlg(translate_text_item("Out of range"), translate_text_item("Value must be ") + setting_error_msg + " !")))
    }

    function setting_checkchange(e, t) { var n, a = setting(e, t).value.trim(); "F" == scl[e].type && (n = defval(e), "1" == a ? n |= getFlag(e, t) : n &= ~getFlag(e, t), a = n), defval(e) == a ? (console.log("values are identical"), setBtn(e, t, "btn-default"), setIcon(e, t, ""), setIconHTML(e, t, ""), setStatus(e, t, "has-feedback")) : setting_check_value(a, e) ? setsettingchanged(e, t) : (console.log("change bad"), setsettingerror(e, t)) }

    function setsettingchanged(e, t) { setStatus(e, t, "has-feedback has-warning"), setBtn(e, t, "btn-warning"), setIcon(e, t, "has-warning ico_feedback"), setIconHTML(e, t, get_icon_svg("warning-sign")) }

    function setsettingerror(e, t) { setBtn(e, t, "btn-danger"), setIcon(e, t, "has-error ico_feedback"), setIconHTML(e, t, get_icon_svg("remove")), setStatus(e, t, "has-feedback has-error") }

    function setESPsettingsSuccess(e) { update_UI_setting() }

    function setESPsettingsfailed(e, t) { alertdlg(translate_text_item("Set failed"), "Error " + e + " :" + t), console.log("Error " + e + " :" + t), setBtn(setting_lasti, setting_lastj, "btn-danger"), id("icon_setting_" + setting_lasti + "_" + setting_lastj).className = "form-control-feedback has-error ico_feedback", id("icon_setting_" + setting_lasti + "_" + setting_lastj).innerHTML = get_icon_svg("remove"), setStatus(setting_lasti, setting_lastj, "has-feedback has-error") }

    function getESPsettingsSuccess(e) {
        if (!process_settings_answer(e)) return getESPsettingsfailed(406, translate_text_item("Wrong data")), void console.log(e);
        displayNone("settings_loader"), displayBlock("settings_list_content"), displayNone("settings_status"), displayBlock("settings_refresh_btn")
    }

    function getESPsettingsfailed(e, t) { console.log("Error " + e + " :" + t), displayNone("settings_loader"), displayBlock("settings_status"), id("settings_status").innerHTML = translate_text_item("Failed:") + e + " " + t, displayBlock("settings_refresh_btn") }

    function restart_esp() { confirmdlg(translate_text_item("Please Confirm"), translate_text_item("Restart FluidNC"), process_restart_esp) }

    function process_restart_esp(e) { "yes" == e && restartdlg() }

    function define_esp_role(e) {
        switch (Number(defval(e))) {
            case SETTINGS_FALLBACK_MODE:
                displayBlock("setup_STA"), displayBlock("setup_AP");
                break;
            case SETTINGS_AP_MODE:
                displayNone("setup_STA"), displayBlock("setup_AP");
                break;
            case SETTINGS_STA_MODE:
                displayBlock("setup_STA"), displayNone("setup_AP");
                break;
            default:
                displayNone("setup_STA"), displayNone("setup_AP")
        }
    }

    function define_esp_role_from_pos(e) { define_esp_role(get_index_from_eeprom_pos(e)) }
    var active_wizard_page = 0,
        maz_page_wizard = 5;

    function td(e) { return "<td>" + e + "</td>" }

    function table(e) { return "<table><tr>" + e + "</tr></table>" }

    function heading(e) { return "<h4>" + translate_text_item(e) + "</h4><hr>" }

    function item(e, t, n) { return translate_text_item(e) + table(build_control_from_pos(t, n)) }

    function wizardDone(e) { id(e).className = id(e).className.replace(" wizard_done", "") }

    function disableStep(e, t) { id(e).style.background = "#e0e0e0", id(t).disabled = !0, id(t).className = "steplinks disabled", wizardDone(t) }

    function openStep(e, t) { id(e).style.background = "#337AB7", id(t).disabled = "", id(t).className = id(t).className.replace(" disabled", "") }

    function closeStep(e) {-1 == id(e).className.indexOf(" wizard_done") && (id(e).className += " wizard_done", can_revert_wizard || (id(e).className += " no_revert_wizard")) }

    function spacer() { return "<hr>\n" }

    function div(e) { return "<div id='" + e + "'>" }

    function endDiv() { return "</div>" }

    function setupdlg() {
        setup_is_done = !1, language_save = language, displayNone("main_ui"), id("settings_list_data").innerHTML = "", active_wizard_page = 0, wizardDone("startsteplink"), id("wizard_button").innerHTML = translate_text_item("Start setup"), disableStep("wizard_line1", "step1link"), disableStep("wizard_line2", "step2link"), disableStep("wizard_line3", "step3link"), displayNone("step3link"), displayNone("wizard_line4"), disableStep("wizard_line4", "endsteplink");
        var e = table(td(get_icon_svg("flag") + "&nbsp;") + td(build_language_list("language_selection")));
        id("setup_langage_list").innerHTML = e, null != setactiveModal("setupdlg.html", setupdone) && (showModal(), id("startsteplink", !0).click())
    }

    function setupdone(e) { do_not_build_settings = !(setup_is_done = !0), build_HTML_setting_list(current_setting_filter), translate_text(language_save), displayUndoNone("main_ui"), closeModal("setup done") }

    function continue_setup_wizard() {
        switch (++active_wizard_page) {
            case 1:
                enablestep1(), preferenceslist[0].language = language, SavePreferences(!0), language_save = language;
                break;
            case 2:
                enablestep2();
                break;
            case 3:
                active_wizard_page++, id("wizard_line3").style.background = "#337AB7", enablestep4();
                break;
            case 4:
                enablestep4();
                break;
            case 5:
                closeModal("ok");
                break;
            default:
                console.log("wizard page out of range")
        }
    }

    function enablestep1() {
        var e = "";
        closeStep("startsteplink"), id("wizard_button").innerHTML = translate_text_item("Continue"), openStep("wizard_line1", "step1link"), e += heading("FluidNC Settings"), e += item("Define ESP name:", EP_HOSTNAME), id("step1").innerHTML = e, id("step1link").click()
    }

    function enablestep2() {
        var e = "";
        closeStep("step1link"), openStep("wizard_line2", "step2link"), e += heading("WiFi Configuration"), e += item("Define ESP role:", EP_WIFI_MODE, "define_esp_role"), e += translate_text_item("AP define access point / STA allows to join existing network") + "<br>", e += spacer(), e += div("setup_STA"), e += item("What access point ESP need to be connected to:", EP_STA_SSID), e += translate_text_item("You can use scan button, to list available access points.") + "<br>", e += spacer(), e += item("Password to join access point:", EP_STA_PASSWORD), e += endDiv(), e += div("setup_AP"), e += item("What is ESP access point SSID:", EP_AP_SSID), e += spacer(), e += item("Password for access point:", EP_AP_PASSWORD), e += endDiv(), id("step2").innerHTML = e, define_esp_role_from_pos(EP_WIFI_MODE), id("step2link").click()
    }

    function define_sd_role(e) {
        (1 == setting_configList[e].defaultvalue ? displayBlock : displayNone)("setup_SD"), displayNone("setup_primary_SD")
    }

    function enablestep3() {
        var e = "";
        closeStep("step2link"), openStep("wizard_line3", "step3link"), e += heading("SD Card Configuration"), e += item("Is ESP connected to SD card:", EP_IS_DIRECT_SD, "define_sd_role"), e += spacer(), e += div("setup_SD"), e += item("Check update using direct SD access:", EP_DIRECT_SD_CHECK), e += spacer(), e += div("setup_primary_SD"), e += item("SD card connected to ESP", EP_PRIMARY_SD), e += spacer(), e += item("SD card connected to printer", EP_SECONDARY_SD), e += spacer(), e += endDiv(), e += endDiv(), id("step3").innerHTML = e, define_sd_role(get_index_from_eeprom_pos(EP_IS_DIRECT_SD)), id("step3link").click()
    }

    function enablestep4() { closeStep("step3link"), id("wizard_button").innerHTML = translate_text_item("Close"), openStep("wizard_line4", "endsteplink"), id("endsteplink").click() }
    var fromPairs = function(e) {
            for (var t = -1, n = e ? e.length : 0, a = {}; ++t < n;) {
                var i = e[t];
                a[i[0]] = i[1]
            }
            return a
        },
        partitionWordsByGroup = function(e) {
            for (var t = [], n = 0; n < e.length; ++n) {
                var a = e[n],
                    i = a[0];
                "G" !== i && "M" !== i && "T" !== i ? 0 < t.length ? t[t.length - 1].push(a) : t.push([a]) : t.push([a])
            }
            return t
        },
        interpret = function(e, t) {
            for (var n = partitionWordsByGroup(t.words), a = 0; a < n.length; ++a) {
                var i = n[a],
                    o = i[0] || [],
                    r = o[0],
                    s = o[1],
                    l = "",
                    o = {};
                "G" === r ? (l = r + s, o = fromPairs(i.slice(1)), 0 === s || 1 === s || 2 === s || 3 === s || 38.2 === s || 38.3 === s || 38.4 === s || 38.5 === s ? e.motionMode = l : 80 === s && (e.motionMode = "")) : "M" === r ? (l = r + s, o = fromPairs(i.slice(1))) : "T" === r || "F" === r ? (l = r, o = s) : "X" !== r && "Y" !== r && "Z" !== r && "A" !== r && "B" !== r && "C" !== r && "I" !== r && "J" !== r && "K" !== r && "P" !== r || (l = e.motionMode, o = fromPairs(i)), l && ("function" == typeof e.handlers[l] && (0, e.handlers[l])(o), "function" == typeof e[l] && e[l].bind(e)(o))
            }
        };

    function Interpreter(e) { this.motionMode = "G0", this.handlers = {}, (e = e || {}).handlers = e.handlers || {}, this.handlers = e.handlers } Interpreter.prototype.loadFromLinesSync = function(e) {
        for (var t = 0; t < e.length; ++t) {
            var n = e[t].trim();
            0 !== n.length && interpret(this, parseLine(n, {}))
        }
    };
    var parseLine = function() {
            var t, n, a, d = (t = new RegExp(/\s*\([^\)]*\)/g), n = new RegExp(/\s*;.*/g), a = new RegExp(/\s+/g), function(e) { return e.replace(t, "").replace(n, "").replace(a, "") }),
                u = /(%.*)|((?:\$\$)|(?:\$[a-zA-Z0-9#]*))|([a-zA-Z][0-9\+\-\.]*)|(\*[0-9]+)/gim;
            return function(e, t) {
                (t = t || {}).flatten = !!t.flatten, t.noParseLine = !!t.noParseLine;
                var n = { line: e };
                if (t.noParseLine) return n;
                n.words = [];
                for (var a = void 0, i = void 0, o = d(e).match(u) || [], r = 0; r < o.length; ++r) {
                    var s = o[r],
                        l = s[0].toUpperCase(),
                        c = s.slice(1);
                    "%" !== l ? "$" !== l ? "N" !== l || void 0 !== a ? "*" !== l || void 0 !== i ? (s = Number(c), Number.isNaN(s) && (s = c), t.flatten ? n.words.push(l + s) : n.words.push([l, s])) : i = Number(c) : a = Number(c) : n.cmds = (n.cmds || []).concat("" + l + c) : n.cmds = (n.cmds || []).concat(e.trim())
                }
                return void 0 !== a && (n.ln = a), void 0 !== i && (n.cs = i), n.cs && function(e) { 0 <= (e = e || "").lastIndexOf("*") && (e = e.substr(0, e.lastIndexOf("*"))); for (var t = 0, n = 0; n < e.length; ++n) t ^= e[n].charCodeAt(0); return t }(e) !== n.cs && (n.err = !0), n
            }
        }(),
        _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) { return typeof e } : function(e) { return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e },
        _extends = Object.assign || function(e) { for (var t = 1; t < arguments.length; t++) { var n, a = arguments[t]; for (n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]) } return e },
        _createClass = function() {
            function a(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(e, t, n) { return t && a(e.prototype, t), n && a(e, n), e }
        }();

    function _classCallCheck(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") }

    function in2mm(e) { return 25.4 * e }
    var Toolpath = function() {
            function c(e) {
                var u = this;

                function i(e) { return { x: e.x + u.g92offset.x, y: e.y + u.g92offset.y, z: e.z + u.g92offset.z } }

                function a(e, t) { u.fn.addLine(u.modal, i(e), i(t)) }

                function p(e, t, n, a) { u.fn.addArcCurve(u.modal, i(e), i(t), i(n), a) } _classCallCheck(this, c), this.g92offset = { x: 0, y: 0, z: 0 }, this.position = { x: 0, y: 0, z: 0 }, this.modal = { motion: "G0", wcs: "G54", plane: "G17", units: "G21", distance: "G90", arc: "G91.1", feedrate: "G94", cutter: "G40", tlo: "G49", program: "M0", spindle: "M5", coolant: "M9", tool: 0 }, this.handlers = {
                    G0: function(e) {
                        "G0" !== u.modal.motion && u.setModal({ motion: "G0" });
                        var t = { x: u.position.x, y: u.position.y, z: u.position.z },
                            n = { x: u.translateX(e.X), y: u.translateY(e.Y), z: u.translateZ(e.Z) },
                            e = { x: n.x, y: n.y, z: n.z };
                        a(t, n), u.setPosition(e.x, e.y, e.z)
                    },
                    G1: function(e) {
                        "G1" !== u.modal.motion && u.setModal({ motion: "G1" });
                        var t = { x: u.position.x, y: u.position.y, z: u.position.z },
                            n = { x: u.translateX(e.X), y: u.translateY(e.Y), z: u.translateZ(e.Z) },
                            e = { x: n.x, y: n.y, z: n.z };
                        a(t, n), u.setPosition(e.x, e.y, e.z)
                    },
                    G2: function(e) {
                        "G2" !== u.modal.motion && u.setModal({ motion: "G2" });
                        var t = { x: u.position.x, y: u.position.y, z: u.position.z },
                            n = { x: u.translateX(e.X), y: u.translateY(e.Y), z: u.translateZ(e.Z) },
                            a = { x: u.translateI(e.I), y: u.translateJ(e.J), z: u.translateK(e.K) },
                            i = { x: n.x, y: n.y, z: n.z };
                        if (u.isXYPlane()) {
                            var o = [t.x, t.y, t.z];
                            t.x = o[0], t.y = o[1], t.z = o[2];
                            o = [n.x, n.y, n.z];
                            n.x = o[0], n.y = o[1], n.z = o[2];
                            o = [a.x, a.y, a.z];
                            a.x = o[0], a.y = o[1], a.z = o[2]
                        } else if (u.isZXPlane()) {
                            var r = [t.z, t.x, t.y];
                            t.x = r[0], t.y = r[1], t.z = r[2];
                            var s = [n.z, n.x, n.y];
                            n.x = s[0], n.y = s[1], n.z = s[2];
                            var r = [a.z, a.x, a.y];
                            a.x = r[0], a.y = r[1], a.z = r[2]
                        } else {
                            if (!u.isYZPlane()) return void console.error("The plane mode is invalid", u.modal.plane);
                            var l = [t.y, t.z, t.x];
                            t.x = l[0], t.y = l[1], t.z = l[2];
                            var c = [n.y, n.z, n.x];
                            n.x = c[0], n.y = c[1], n.z = c[2];
                            var d = [a.y, a.z, a.x];
                            a.x = d[0], a.y = d[1], a.z = d[2]
                        }
                        e.R && (s = u.translateR(Number(e.R) || 0), r = n.x - t.x, l = n.y - t.y, c = Math.sqrt(r * r + l * l), d = -(d = Math.sqrt(4 * s * s - r * r - l * l) / 2), s = l / 2 + r / c * (d = s < 0 ? -d : d), a.x = t.x + (r / 2 - l / c * d), a.y = t.y + s), p(t, n, a, e.P || 0), u.setPosition(i.x, i.y, i.z)
                    },
                    G3: function(e) {
                        "G3" !== u.modal.motion && u.setModal({ motion: "G3" });
                        var t = u.position,
                            n = { x: u.translateX(e.X), y: u.translateY(e.Y), z: u.translateZ(e.Z) },
                            a = { x: u.translateI(e.I), y: u.translateJ(e.J), z: u.translateK(e.K) },
                            i = { x: n.x, y: n.y, z: n.z };
                        if (u.isXYPlane()) {
                            var o = [t.x, t.y, t.z];
                            t.x = o[0], t.y = o[1], t.z = o[2];
                            o = [n.x, n.y, n.z];
                            n.x = o[0], n.y = o[1], n.z = o[2];
                            o = [a.x, a.y, a.z];
                            a.x = o[0], a.y = o[1], a.z = o[2]
                        } else if (u.isZXPlane()) {
                            var r = [t.z, t.x, t.y];
                            t.x = r[0], t.y = r[1], t.z = r[2];
                            var s = [n.z, n.x, n.y];
                            n.x = s[0], n.y = s[1], n.z = s[2];
                            var r = [a.z, a.x, a.y];
                            a.x = r[0], a.y = r[1], a.z = r[2]
                        } else {
                            if (!u.isYZPlane()) return void console.error("The plane mode is invalid", u.modal.plane);
                            var l = [t.y, t.z, t.x];
                            t.x = l[0], t.y = l[1], t.z = l[2];
                            var c = [n.y, n.z, n.x];
                            n.x = c[0], n.y = c[1], n.z = c[2];
                            var d = [a.y, a.z, a.x];
                            a.x = d[0], a.y = d[1], a.z = d[2]
                        }
                        e.R && (s = u.translateR(Number(e.R) || 0), r = n.x - t.x, l = n.y - t.y, c = Math.sqrt(r * r + l * l), d = Math.sqrt(4 * s * s - r * r - l * l) / 2, s = l / 2 + r / c * (d = s < 0 ? -d : d), a.x = t.x + (r / 2 - l / c * d), a.y = t.y + s), p(t, n, a, e.P || 0), u.setPosition(i.x, i.y, i.z)
                    },
                    G4: function(e) {},
                    G10: function(e) {},
                    G17: function(e) { "G17" !== u.modal.plane && u.setModal({ plane: "G17" }) },
                    G18: function(e) { "G18" !== u.modal.plane && u.setModal({ plane: "G18" }) },
                    G19: function(e) { "G19" !== u.modal.plane && u.setModal({ plane: "G19" }) },
                    G20: function(e) { "G20" !== u.modal.units && u.setModal({ units: "G20" }) },
                    G21: function(e) { "G21" !== u.modal.units && u.setModal({ units: "G21" }) },
                    "G38.2": function(e) { "G38.2" !== u.modal.motion && u.setModal({ motion: "G38.2" }) },
                    "G38.3": function(e) { "G38.3" !== u.modal.motion && u.setModal({ motion: "G38.3" }) },
                    "G38.4": function(e) { "G38.4" !== u.modal.motion && u.setModal({ motion: "G38.4" }) },
                    "G38.5": function(e) { "G38.5" !== u.modal.motion && u.setModal({ motion: "G38.5" }) },
                    "G43.1": function(e) { "G43.1" !== u.modal.tlo && u.setModal({ tlo: "G43.1" }) },
                    G49: function() { "G49" !== u.modal.tlo && u.setModal({ tlo: "G49" }) },
                    G54: function() { "G54" !== u.modal.wcs && u.setModal({ wcs: "G54" }) },
                    G55: function() { "G55" !== u.modal.wcs && u.setModal({ wcs: "G55" }) },
                    G56: function() { "G56" !== u.modal.wcs && u.setModal({ wcs: "G56" }) },
                    G57: function() { "G57" !== u.modal.wcs && u.setModal({ wcs: "G57" }) },
                    G58: function() { "G58" !== u.modal.wcs && u.setModal({ wcs: "G58" }) },
                    G59: function() { "G59" !== u.modal.wcs && u.setModal({ wcs: "G59" }) },
                    G80: function() { "G80" !== u.modal.motion && u.setModal({ motion: "G80" }) },
                    G90: function() { "G90" !== u.modal.distance && u.setModal({ distance: "G90" }) },
                    G91: function() { "G91" !== u.modal.distance && u.setModal({ distance: "G91" }) },
                    G92: function(e) {
                        var t;
                        void 0 === e.X && void 0 === e.Y && void 0 === e.Z ? (u.position.x += u.g92offset.x, u.g92offset.x = 0, u.position.y += u.g92offset.y, u.g92offset.y = 0, u.position.z += u.g92offset.z, u.g92offset.z = 0) : (null != e.X && (t = u.translateX(e.X, !1), u.g92offset.x += u.position.x - t, u.position.x = t), null != e.Y && (t = u.translateY(e.Y, !1), u.g92offset.y += u.position.y - t, u.position.y = t), null != e.Z && (e = u.translateX(e.Z, !1), u.g92offset.z += u.position.z - e, u.position.z = e))
                    },
                    "G92.1": function(e) { u.position.x += u.g92offset.x, u.g92offset.x = 0, u.position.y += u.g92offset.y, u.g92offset.y = 0, u.position.z += u.g92offset.z, u.g92offset.z = 0 },
                    G93: function() { "G93" !== u.modal.feedmode && u.setModal({ feedmode: "G93" }) },
                    G94: function() { "G94" !== u.modal.feedmode && u.setModal({ feedmode: "G94" }) },
                    G95: function() { "G95" !== u.modal.feedmode && u.setModal({ feedmode: "G95" }) },
                    M0: function() { "M0" !== u.modal.program && u.setModal({ program: "M0" }) },
                    M1: function() { "M1" !== u.modal.program && u.setModal({ program: "M1" }) },
                    M2: function() { "M2" !== u.modal.program && u.setModal({ program: "M2" }) },
                    M30: function() { "M30" !== u.modal.program && u.setModal({ program: "M30" }) },
                    M3: function(e) { "M3" !== u.modal.spindle && u.setModal({ spindle: "M3" }) },
                    M4: function(e) { "M4" !== u.modal.spindle && u.setModal({ spindle: "M4" }) },
                    M5: function() { "M5" !== u.modal.spindle && u.setModal({ spindle: "M5" }) },
                    M6: function(e) { e && void 0 !== e.T && u.setModal({ tool: e.T }) },
                    M7: function() {
                        var e = u.modal.coolant.split(",");
                        0 <= e.indexOf("M7") || u.setModal({ coolant: 0 <= e.indexOf("M8") ? "M7,M8" : "M7" })
                    },
                    M8: function() {
                        var e = u.modal.coolant.split(",");
                        0 <= e.indexOf("M8") || u.setModal({ coolant: 0 <= e.indexOf("M7") ? "M7,M8" : "M8" })
                    },
                    M9: function() { "M9" !== u.modal.coolant && u.setModal({ coolant: "M9" }) },
                    T: function(e) { void 0 !== e && u.setModal({ tool: e }) }
                };
                var t = _extends({}, e),
                    n = t.position,
                    o = t.modal,
                    r = t.addLine,
                    s = void 0 === r ? noop : r,
                    e = t.addArcCurve,
                    r = void 0 === e ? noop : e;
                n && (e = (t = _extends({}, n)).x, n = t.y, t = t.z, this.setPosition(e, n, t)), this.g92offset.x = this.g92offset.y = this.g92offset.z = 0;
                var l = {};
                Object.keys(_extends({}, o)).forEach(function(e) { Object.prototype.hasOwnProperty.call(u.modal, e) && (l[e] = o[e]) }), this.setModal(l), this.fn = { addLine: s, addArcCurve: r };
                r = new Interpreter({ handlers: this.handlers });
                return r.getPosition = function() { return _extends({}, u.position) }, r.getModal = function() { return _extends({}, u.modal) }, r.setPosition = function() { return u.setPosition.apply(u, arguments) }, r.setModal = function(e) { return u.setModal(e) }, r
            }
            return _createClass(c, [{ key: "setModal", value: function(e) { return this.modal = _extends({}, this.modal, e), this.modal } }, { key: "isMetricUnits", value: function() { return "G21" === this.modal.units } }, { key: "isImperialUnits", value: function() { return "G20" === this.modal.units } }, { key: "isAbsoluteDistance", value: function() { return "G90" === this.modal.distance } }, { key: "isRelativeDistance", value: function() { return "G91" === this.modal.distance } }, { key: "isXYPlane", value: function() { return "G17" === this.modal.plane } }, { key: "isZXPlane", value: function() { return "G18" === this.modal.plane } }, { key: "isYZPlane", value: function() { return "G19" === this.modal.plane } }, { key: "setPosition", value: function() { for (var e, t, n, a = arguments.length, i = Array(a), o = 0; o < a; o++) i[o] = arguments[o]; "object" === _typeof(i[0]) ? (e = (n = _extends({}, i[0])).x, t = n.y, n = n.z, this.position.x = "number" == typeof e ? e : this.position.x, this.position.y = "number" == typeof t ? t : this.position.y, this.position.z = "number" == typeof n ? n : this.position.z) : (e = i[0], t = i[1], n = i[2], this.position.x = "number" == typeof e ? e : this.position.x, this.position.y = "number" == typeof t ? t : this.position.y, this.position.z = "number" == typeof n ? n : this.position.z) } }, { key: "translatePosition", value: function(e, t, n) { return null == t ? e : (t = this.isImperialUnits() ? in2mm(t) : t, t = Number(t), Number.isNaN(t) ? e : n ? e + t : t) } }, { key: "translateX", value: function(e, t) { return this.translatePosition(this.position.x, e, t) } }, { key: "translateY", value: function(e, t) { return this.translatePosition(this.position.y, e, t) } }, { key: "translateZ", value: function(e, t) { return this.translatePosition(this.position.z, e, t) } }, { key: "translateI", value: function(e) { return this.translateX(e, !0) } }, { key: "translateJ", value: function(e) { return this.translateY(e, !0) } }, { key: "translateK", value: function(e) { return this.translateZ(e, !0) } }, { key: "translateR", value: function(e) { return e = Number(e), Number.isNaN(e) ? 0 : this.isImperialUnits() ? in2mm(e) : e } }]), c
        }(),
        statuspage = 0,
        statuscontent = "";

    function statusdlg() { null != setactiveModal("statusdlg.html") && (showModal(), refreshstatus(), update_btn_status(0)) }

    function next_status() {
        var e = getactiveModal().element.getElementsByClassName("modal-text")[0];
        e.innerHTML = 0 == statuspage ? statuscontent : "<table><tr><td width='auto' style='vertical-align:top;'><label translate>Browser:</label></td><td>&nbsp;</td><td width='100%'><span class='text-info'><strong>" + navigator.userAgent + "</strong></span></td></tr></table>", update_btn_status()
    }

    function update_btn_status(e) { 0 == (statuspage = void 0 !== e ? e : statuspage) ? (statuspage = 1, id("next_status_btn").innerHTML = get_icon_svg("triangle-right", "1em", "1em")) : (statuspage = 0, id("next_status_btn").innerHTML = get_icon_svg("triangle-left", "1em", "1em")) }

    function statussuccess(e) {
        displayBlock("refreshstatusbtn"), displayNone("status_loader");
        var t = getactiveModal();
        if (null != t) {
            var t = t.element.getElementsByClassName("modal-text")[0],
                n = e.split("\n");
            statuscontent = "";
            for (var a = 0; a < n.length; a++) {
                var i = n[a].split(":");
                if (2 <= i.length) {
                    statuscontent += "<label>" + translate_text_item(i[0]) + ": </label>&nbsp;<span class='text-info'><strong>";
                    var o = i[1].split(" (");
                    for (statuscontent += translate_text_item(o[0].trim()), v = 1; v < o.length; v++) statuscontent += " (" + o[v];
                    for (v = 2; v < i.length; v++) statuscontent += ":" + i[v];
                    statuscontent += "</strong></span><br>"
                }
            }
            statuscontent += "<label>" + translate_text_item("WebUI version") + ": </label>&nbsp;<span class='text-info'><strong>", statuscontent += web_ui_version, statuscontent += "</strong></span><br>", t.innerHTML = statuscontent, update_btn_status(0)
        }
    }

    function statusfailed(e, t) { displayBlock("refreshstatusbtn"), displayNone("status_loader"), displayBlock("status_msg"), console.log("Error " + e + " : " + t), id("status_msg").innerHTML = "Error " + e + " : " + t }

    function refreshstatus() {
        displayNone("refreshstatusbtn"), displayBlock("status_loader");
        var e = getactiveModal();
        null != e && (e.element.getElementsByClassName("modal-text")[0].innerHTML = "", displayNone("status_msg"), SendGetHttp("/command?plain=" + encodeURIComponent("[ESP420]plain"), statussuccess, statusfailed))
    }
    var gCodeLoaded = !1,
        gCodeDisplayable = !1,
        snd = null,
        sndok = !0;

    function beep(e, t, n) { if (null == snd && sndok) try { snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=") } catch (e) { snd = null, sndok = !1 } snd && snd.play() }

    function tabletClick() { window.navigator && window.navigator.vibrate && window.navigator.vibrate(200), beep(3, 400, 10) } sendCommand = function(e) { SendPrinterCommand(e, !0, get_Position) }, moveTo = function(e) { sendCommand("G90 G0 " + e) }, MDIcmd = function(e) { tabletClick(), sendCommand(e) }, MDI = function(e) { MDIcmd(id(e).value) }, enterFullscreen = function() { try { document.documentElement.requestFullscreen() } catch (e) { try { document.documentElement.webkitRequestFullscreen() } catch (e) { return } } messages.rows = 4, messages.scrollTop = messages.scrollHeight }, exitFullscreen = function() { try { document.exitFullscreen() } catch (e) { try { document.webkitExitFullscreen() } catch (e) { return } } messages.rows = 2, messages.scrollTop = messages.scrollHeight }, toggleFullscreen = function() {
        id("messages");
        (document.fullscreenElement ? exitFullscreen : enterFullscreen)()
    }, inputFocused = function() { isInputFocused = !0 }, inputBlurred = function() { isInputFocused = !1 }, zeroAxis = function(e) { tabletClick(), setAxisByValue(e, 0) }, toggleUnits = function() { tabletClick(), sendCommand("G21" == modal.units ? "G20" : "G21"), sendCommand("$G") }, btnSetDistance = function() {
        tabletClick();
        var e = event.target.innerText;
        id("jog-distance").value = e
    }, setDistance = function(e) { tabletClick(), id("jog-distance").value = e }, jogTo = function(e) { var t = JogFeedrate(e); "G20" == modal.units && (t = (t /= 25.4).toFixed(2)), sendCommand("$J=G91F" + t + e + "\n") }, goAxisByValue = function(e, t) { tabletClick(), moveTo(e + t) }, setAxisByValue = function(e, t) { tabletClick(), sendCommand("G10 L20 P0 " + e + t) }, setAxis = function(e, t) {
        tabletClick(), coordinate = id(t).value;
        e = "G10 L20 P1 " + e + coordinate;
        sendCommand(e)
    };
    var timeout_id = 0,
        hold_time = 1e3,
        longone = !1;

    function long_jog(e) {
        longone = !0, distance = 1e3;
        var t = e.value,
            e = JogFeedrate(t);
        "G20" == modal.units && (distance /= 25.4, distance = distance.toFixed(3), e = (e /= 25.4).toFixed(2)), cmd = "$J=G91F" + e + t + distance + "\n", sendCommand(cmd)
    }
    var joggers = id("jog-controls");

    function tabletShowMessage(e, t) { t || "" == e || e.startsWith("<") || e.startsWith("ok") || e.startsWith("\n") || e.startsWith("\r") || (e.startsWith("error:") && (e = '<span style="color:red;">' + e + "</span>"), (t = id("messages")).innerHTML += "<br>" + e, t.scrollTop = t.scrollHeight, e.startsWith("$/axes/x/max_travel_mm=") && displayer.setXTravel(parseFloat(e.substring(23, e.length))), e.startsWith("$/axes/y/max_travel_mm=") && displayer.setYTravel(parseFloat(e.substring(23, e.length))), e.startsWith("$/axes/x/homing/mpos_mm=") && displayer.setXHome(parseFloat(e.substring(24, e.length))), e.startsWith("$/axes/y/homing/mpos_mm=") && displayer.setYHome(parseFloat(e.substring(24, e.length))), e.startsWith("$/axes/x/homing/positive_direction=") && displayer.setXDir(e.substring(35, e.length)), e.startsWith("$/axes/y/homing/positive_direction=") && displayer.setYDir(e.substring(35, e.length))) }

    function tabletShowResponse(e) { id("messages").value = e } joggers.addEventListener("pointerdown", function(e) {
        e = e.target;
        e.classList.contains("jog") && (timeout_id = setTimeout(long_jog, hold_time, e))
    }), joggers.addEventListener("pointerup", function(e) {
        clearTimeout(timeout_id);
        e = e.target;
        e.classList.contains("jog") && (longone ? (longone = !1, console.log("Jog cancel"), SendRealtimeCmd(133)) : sendMove(e.value))
    }), joggers.addEventListener("pointerout", function(e) { clearTimeout(timeout_id), e.target.classList.contains("jog") && longone && (longone = !1, console.log("Jog cancel"), SendRealtimeCmd(133)) }), sendMove = function(e) {
        tabletClick();

        function t(e) {
            var t = "";
            for (key in e = e || {}) t += key + e[key];
            jogTo(t)
        }

        function n(e) {
            var t = "";
            for (key in e = e || {}) t += key + e[key];
            moveTo(t)
        }
        var a = Number(id("jog-distance").value) || 0,
            e = { G28: function() { sendCommand("G28") }, G30: function() { sendCommand("G30") }, X0Y0Z0: function() { n({ X: 0, Y: 0, Z: 0 }) }, X0: function() { n({ X: 0 }) }, Y0: function() { n({ Y: 0 }) }, Z0: function() { n({ Z: 0 }) }, "X-Y+": function() { t({ X: -a, Y: a }) }, "X+Y+": function() { t({ X: a, Y: a }) }, "X-Y-": function() { t({ X: -a, Y: -a }) }, "X+Y-": function() { t({ X: a, Y: -a }) }, "X-": function() { t({ X: -a }) }, "X+": function() { t({ X: a }) }, "Y-": function() { t({ Y: -a }) }, "Y+": function() { t({ Y: a }) }, "Z-": function() { t({ Z: -a }) }, "Z+": function() { t({ Z: a }) } } [e];
        e && e()
    };
    var setJogSelector = function(e) {
        var n = [],
            t = [],
            a = 0,
            a = "G20" == e ? (n = [.001, .01, .1, 1, .003, .03, .3, 3, .005, .05, .5, 5], t = [25e-5, 5e-4, .001, .003, .005, .01, .03, .05, .1, .3, .5, 1, 3, 5, 10, 30], "1") : (n = [.1, 1, 10, 100, .3, 3, 30, 300, .5, 5, 50, 500], t = [.005, .01, .03, .05, .1, .3, .5, 1, 3, 5, 10, 30, 50, 100, 300, 500, 1e3], "10");
        ["jog00", "jog01", "jog02", "jog03", "jog10", "jog11", "jog12", "jog13", "jog20", "jog21", "jog22", "jog23"].forEach(function(e, t) { id(e).innerHTML = n[t] });
        var i = id("jog-distance");
        i.length = 0, i.innerText = null, t.forEach(function(e) {
            var t = document.createElement("option");
            t.textContent = e, t.selected = e == a, i.appendChild(t)
        })
    };

    function removeJogDistance(e, t) { selector = id("jog-distance"), selector.removeChild(e), selector.selectedIndex = t }

    function addJogDistance(e) { selector = id("jog-distance"); var t = document.createElement("option"); return t.textContent = e, t.selected = !0, selector.appendChild(t) }
    var runTime = 0,
        leftButtonHandler, rightButtonHandler;

    function setButton(e, t, n, a) {
        e = id(e);
        e.disabled = !t, e.style.backgroundColor = n, e.innerText = a
    }

    function setLeftButton(e, t, n, a) { setButton("btn-start", e, t, n), leftButtonHandler = a }

    function doLeftButton() { leftButtonHandler && leftButtonHandler() }

    function setRightButton(e, t, n, a) { setButton("btn-pause", e, t, n), rightButtonHandler = a }

    function doRightButton() { rightButtonHandler && rightButtonHandler() }
    var green = "#86f686",
        red = "#f64646",
        gray = "#f6f6f6";

    function setRunControls() { gCodeLoaded ? setLeftButton(!0, green, "Start", runGCode) : setLeftButton(!1, gray, "Start", null), setRightButton(!1, gray, "Pause", null) }
    var grblReportingUnits = 0,
        startTime = 0,
        spindleDirection = "",
        spindleSpeed = "";

    function stopAndRecover() { stopGCode(), requestModes() }
    var oldCannotClick = null;

    function tabletUpdateModal() {
        var e = "G21" == modal.units ? "mm" : "Inch";
        getText("units") != e && (setText("units", e), setJogSelector(modal.units))
    }

    function tabletGrblState(e, t) {
        var n = e.stateName,
            a = 1;
        switch (modal.units) {
            case "G20":
                a = 0 === grblReportingUnits ? 1 / 25.4 : 1;
                break;
            case "G21":
                a = 0 === grblReportingUnits ? 1 : 25.4
        }
        var i = "Run" == n || "Hold" == n;
        switch (oldCannotClick != i && (selectDisabled(".control-pad .form-control", i), selectDisabled(".control-pad .btn", i), selectDisabled(".dropdown-toggle", i), selectDisabled(".axis-position .position", i), selectDisabled(".axis-position .form-control", i), selectDisabled(".axis-position .btn", i), selectDisabled(".axis-position .position", i), i || contractVisualizer()), oldCannotClick = i, tabletUpdateModal(), n) {
            case "Sleep":
            case "Alarm":
                setLeftButton(!0, gray, "Start", null), setRightButton(!1, gray, "Pause", null);
                break;
            case "Idle":
                setRunControls();
                break;
            case "Hold":
                setLeftButton(!0, green, "Resume", resumeGCode), setRightButton(!0, red, "Stop", stopAndRecover);
                break;
            case "Jog":
            case "Home":
            case "Run":
                setLeftButton(!1, gray, "Start", null), setRightButton(!0, red, "Pause", pauseGCode);
                break;
            case "Check":
                setLeftButton(!0, gray, "Start", null), setRightButton(!0, red, "Stop", stopAndRecover)
        }
        if (e.spindleDirection) switch (e.spindleDirection) {
            case "M3":
                spindleDirection = "CW";
                break;
            case "M4":
                spindleDirection = "CCW";
                break;
            case "M5":
                spindleDirection = "Off";
                break;
            default:
                spindleDirection = ""
        }
        setText("spindle-direction", spindleDirection), setText("spindle-speed", spindleSpeed = e.spindleSpeed ? Number(e.spindleSpeed) : "");
        var o = new Date;
        setText("time-of-day", o.getHours() + ":" + String(o.getMinutes()).padStart(2, "0")), setText("runtime", runTime = "Run" == n ? ((i = o.getTime() - startTime) < 0 && (i = 0), i = Math.floor(i / 1e3), Math.floor(i / 60) + ":" + (i = (i %= 60) < 10 ? "0" + i : i)) : (startTime = o.getTime(), "0:00")), setText("wpos-label", modal.wcs), setHTML("distance", "G90" == modal.distance ? modal.distance : "<div style='color:red'>" + modal.distance + "</div>");
        setText("active-state", "Run" == n ? ("G21" == modal.units ? Number(e.feedrate).toFixed(0) : Number(e.feedrate / 25.4).toFixed(2)) + ("G21" == modal.units ? " mm/min" : " in/min") + " " + spindleSpeed + " " + spindleDirection : n);
        modal.distance, modal.wcs, modal.units, modal.tool, modal.feedrate, modal.spindle;
        setHTML("gcode-states", modal.modes || "GCode State"), !e.lineNumber || "Run" != n && "Hold" != n && "Stop" != n || (setText("line", e.lineNumber), gCodeDisplayable && scrollToLine(e.lineNumber)), gCodeDisplayable && displayer.reDrawTool(modal, arrayToXYZ(WPOS));
        var r = "G20" == modal.units ? 4 : 2;
        WPOS && WPOS.forEach(function(e, t) { setTextContent("wpos-" + axisNames[t], Number(e * a).toFixed(2 < t ? 2 : r)) }), MPOS.forEach(function(e, t) { setTextContent("mpos-" + axisNames[t], Number(e * a).toFixed(2 < t ? 2 : r)) })
    }

    function addOption(e, t, n, a, i) {
        var o = document.createElement("option");
        o.appendChild(document.createTextNode(t)), o.disabled = a, o.selected = i, o.value = n, e.appendChild(o)
    }

    function toggleVisualizer() {
        (id("mdifiles").hidden ? contractVisualizer : expandVisualizer)()
    }

    function contractVisualizer() { id("mdifiles").hidden = !1, id("setAxis").hidden = !1, displayBlock("jog-controls"), setBottomHeight() }

    function expandVisualizer() { id("mdifiles").hidden = !0, id("setAxis").hidden = !0, displayNone("jog-controls"), setBottomHeight() }
    var gCodeFilename = "";

    function populateTabletFileSelector(e, t) {
        var n, a, i = id("filelist"),
            o = gCodeFilename.split("/").slice(-1)[0];
        i.length = 0, i.selectedIndex = 0, e.length ? (n = "/" === t, addOption(i, "Load GCode File from /SD" + t, -2, !0, !0), n || addOption(i, "..", -1, !1, !1), a = !1, e.forEach(function(e, t) {
            var n;
            e.isprintable && ((n = e.name == o) && (a = !0), addOption(i, e.name, t, !1, n))
        }), a || (gCodeDisplayable = !1, setHTML("filename", gCodeFilename = ""), showGCode("")), e.forEach(function(e, t) { e.isdir && addOption(i, e.name + "/", t, !1, !1) })) : addOption(i, "No files found", -3, !0, "" == o)
    }

    function tabletGetFileList(e) { gCodeFilename = "", SendGetHttp("/upload?path=" + encodeURI(e), files_list_success) }

    function tabletInit() { tabletGetFileList("/"), requestModes() }

    function arrayToXYZ(e) { return { x: e[0], y: e[1], z: e[2] } }

    function showGCode(e) {
        (gCodeLoaded = "" != e) ? (id("gcode").value = e, WPOS[0], WPOS[1], WPOS[2], gCodeDisplayable && displayer.showToolpath(e, modal, arrayToXYZ(WPOS))) : (id("gcode").value = "(No GCode loaded)", displayer.clear()), setRunControls()
    }
    var machineBboxAsked = !1;

    function askMachineBbox() { machineBboxAsked || (machineBboxAsked = !0, SendPrinterCommand("$/axes/x/max_travel_mm"), SendPrinterCommand("$/axes/x/homing/mpos_mm"), SendPrinterCommand("$/axes/x/homing/positive_direction"), SendPrinterCommand("$/axes/y/max_travel_mm"), SendPrinterCommand("$/axes/y/homing/mpos_mm"), SendPrinterCommand("$/axes/y/homing/positive_direction")) }

    function nthLineEnd(e, t) { if (t <= 0) return 0; for (var n = e.length, a = -1; t-- && a++ < n && !((a = e.indexOf("\n", a)) < 0);); return a }

    function scrollToLine(e) {
        var t, n = id("gcode"),
            a = parseFloat(getComputedStyle(n).getPropertyValue("line-height")),
            i = n.value;
        n.scrollTop = e * a, i = e <= 0 ? (t = 0, 1) : (t = 1 == e ? 0 : nthLineEnd(i, e) + 1, i.indexOf("\n", t)), n.select(), n.setSelectionRange(t, i)
    }

    async function runGCode() { 
        await checkHomed();
        if (homed == 0) { infodlg(translate_text_item("Machine not homed"), translate_text_item("Please home your machine first")); return; }
        gCodeFilename && sendCommand("$sd/run=" + gCodeFilename), expandVisualizer()
    }

    function tabletSelectGCodeFile(t) {
        var e = id("filelist");
        Array.from(e.options).find(e => e.text == t).selected = !0
    }

    function tabletLoadGCodeFile(e, t) { gCodeFilename = e, isNaN(t) && (t.endsWith("MB") || t.endsWith("GB")) || 1e6 < t ? (setHTML("filename", gCodeFilename + " (too large to show)"), showGCode("GCode file too large to display (> 1MB)"), gCodeDisplayable = !1, displayer.clear()) : (gCodeDisplayable = !0, setHTML("filename", gCodeFilename), fetch(encodeURIComponent("SD" + gCodeFilename)).then(e => e.text()).then(e => showGCode(e))) }

    function selectFile() {
        tabletClick();
        var e = id("filelist"),
            t = Number(e.options[e.selectedIndex].value);
        if (-3 !== t && -2 !== t) {
            if (-1 === t) return gCodeFilename = "", void files_go_levelup();
            e = files_file_list[t], t = e.name;
            e.isdir ? (gCodeFilename = "", files_enter_dir(t)) : tabletLoadGCodeFile(files_currentPath + t, e.size)
        }
    }

    function toggleDropdown() { id("tablet-dropdown-menu").classList.toggle("show") }

    function hideMenu() { toggleDropdown() }

    function menuFullscreen() { toggleFullscreen(), hideMenu() }

    function menuReset() { stopAndRecover(), hideMenu() }

    function menuUnlock() { sendCommand("$X"), hideMenu() }

    function menuHomeAll() { sendCommand("$H"), hideMenu() }

    function menuHomeA() { sendCommand("$HA"), hideMenu() }

    function menuSpindleOff() { sendCommand("M5"), hideMenu() }

    function requestModes() { sendCommand("$G") } cycleDistance = function(e) {
        var t = id("jog-distance"),
            e = t.selectedIndex + (e ? 1 : -1);
        0 <= e && e < t.length && (tabletClick(), t.selectedIndex = e)
    }, clickon = function(e) {
        e = id(e);
        e.classList.add("active"), e.dispatchEvent(new Event("click"))
    };
    var ctrlDown = !1,
        oldIndex = null,
        newChild = null;

    function shiftUp() { newChild && (removeJogDistance(newChild, oldIndex), newChild = null) }

    function altUp() { newChild && (removeJogDistance(newChild, oldIndex), newChild = null) }

    function shiftDown() {
        var e, t;
        newChild || (t = (e = id("jog-distance")).value, oldIndex = e.selectedIndex, newChild = addJogDistance(10 * t))
    }

    function altDown() {
        var e, t;
        newChild || (t = (e = id("jog-distance")).value, oldIndex = e.selectedIndex, newChild = addJogDistance(t / 10))
    }

    function jogClick(e) { clickon(e) }
    var isInputFocused = !1;

    function tabletIsActive() { return "none" !== id("tablettab").style.display }

    function handleKeyDown(e) {
        if (tabletIsActive() && !isInputFocused) switch (e.key) {
            case "ArrowRight":
                jogClick("jog-x-plus"), e.preventDefault();
                break;
            case "ArrowLeft":
                jogClick("jog-x-minus"), e.preventDefault();
                break;
            case "ArrowUp":
                jogClick("jog-y-plus"), e.preventDefault();
                break;
            case "ArrowDown":
                jogClick("jog-y-minus"), e.preventDefault();
                break;
            case "PageUp":
                jogClick("jog-z-plus"), e.preventDefault();
                break;
            case "PageDown":
                jogClick("jog-z-minus"), e.preventDefault();
                break;
            case "Escape":
            case "Pause":
                clickon("btn-pause");
                break;
            case "Shift":
                shiftDown();
                break;
            case "Control":
                ctrlDown = !0;
                break;
            case "Alt":
                altDown();
                break;
            case "=":
            case "+":
                cycleDistance(!0), e.preventDefault();
                break;
            case "-":
                cycleDistance(!1), e.preventDefault();
                break;
            default:
                console.log(e)
        }
    }

    function handleKeyUp(e) {
        if (tabletIsActive() && !isInputFocused) switch (e.key) {
            case "Shift":
                shiftUp();
                break;
            case "Control":
                ctrlDown = !1;
                break;
            case "Alt":
                altUp()
        }
    }

    function mdiEnterKey(e) { "Enter" === e.key && (MDIcmd(e.target.value), e.target.blur()) }

    function fullscreenIfMobile() { /Mobi|Android/i.test(navigator.userAgent) && toggleFullscreen() }

    function height(e) { return e.getBoundingClientRect().height }

    function heightId(e) { return height(id(e)) }

    function bodyHeight() { return height(document.body) }

    function controlHeight() { return heightId("nav-panel") + heightId("axis-position") + heightId("setAxis") + heightId("control-pad") }

    function setBottomHeight() {
        var e, t;
        tabletIsActive() && (e = bodyHeight() - heightId("navbar") - controlHeight(), t = getComputedStyle(id("tablettab")), t = parseFloat(t.paddingTop) + parseFloat(t.paddingBottom), t += 20, id("status").style.height = e - t + "px")
    }

    function updateGcodeViewerAngle() {
        var e = id("gcode").value;
        displayer.cycleCameraAngle(e, modal, arrayToXYZ(WPOS))
    }

    function opentab(e, t, n, a) {
        for (var i, o = classes("tabcontent"), r = new Event("activate"), s = new Event("deactivate"), l = 0; l < o.length; l++) o[l].parentNode.id == n && (o[l].dispatchEvent(s), o[l].style.display = "none");
        for (i = classes("tablinks"), l = 0; l < i.length; l++) i[l].parentNode.id == a && (i[l].className = i[l].className.replace("active", ""));
        id(t).dispatchEvent(r), displayBlock(t), e.currentTarget.className += " active"
    }
    setJogSelector("mm"), id("mditext0").addEventListener("keyup", mdiEnterKey), id("mditext1").addEventListener("keyup", mdiEnterKey), window.addEventListener("keydown", handleKeyDown), window.addEventListener("keyup", handleKeyUp), numpad.attach({ target: "wpos-x", axis: "X" }), numpad.attach({ target: "wpos-y", axis: "Y" }), numpad.attach({ target: "wpos-z", axis: "Z" }), numpad.attach({ target: "wpos-a", axis: "A" }), id("tablettablink").addEventListener("DOMActivate", fullscreenIfMobile, !1), id("tablettab").addEventListener("activate", askMachineBbox, !1), id("control-pad").classList.add("open"), window.onresize = setBottomHeight, id("tablettablink").addEventListener("DOMActivate", setBottomHeight, !1), id("toolpath").addEventListener("mouseup", updateGcodeViewerAngle);
    var root = window,
        canvas = id("toolpath"),
        tp = canvas.getContext("2d", { willReadFrequently: !0 }),
        tpRect;
    tp.lineWidth = .1, tp.lineCap = "round", tp.strokeStyle = "blue";
    var cameraAngle = 0,
        xMaxTravel = 1e3,
        yMaxTravel = 1e3,
        xHomePos = 0,
        yHomePos = 0,
        xHomeDir = 1,
        yHomeDir = 1,
        tpUnits = "G21",
        tpBbox = { min: { x: 1 / 0, y: 1 / 0 }, max: { x: -1 / 0, y: -1 / 0 } },
        bboxIsSet = !1,
        resetBbox = function() { tpBbox.min.x = 1 / 0, tpBbox.min.y = 1 / 0, tpBbox.max.x = -1 / 0, tpBbox.max.y = -1 / 0, bboxIsSet = !1 },
        xx = .707,
        xy = .707,
        xz = 0,
        yx = -.3535,
        yy = .3535,
        yz = 1,
        isoView = function() { xz = 0, yx = -(xy = xx = .707), yy = .707, yz = 1 },
        obliqueView = function() { xy = xx = .707, xz = 0, yx = -.3535, yy = .3535, yz = 1 },
        topView = function() { yy = xx = 1, yz = yx = xz = xy = 0 },
        projection = function(e) { return outpoint = {}, outpoint.x = e.x * xx + e.y * xy + e.z * xz, outpoint.y = e.x * yx + e.y * yy + e.z * yz, outpoint },
        formatLimit = function(e) { return "G20" == tpUnits ? (e / 25.4).toFixed(3) + '"' : e.toFixed(2) + "mm" },
        toolX = null,
        toolY = null,
        toolSave = null,
        toolRadius = 6,
        toolRectWH = 2 * toolRadius + 4,
        drawTool = function(e) { pp = projection(e), toolX = xToPixel(pp.x) - toolRadius - 2, toolY = yToPixel(pp.y) - toolRadius - 2, toolSave = tp.getImageData(toolX, toolY, toolRectWH, toolRectWH), tp.beginPath(), tp.strokeStyle = "magenta", tp.fillStyle = "magenta", tp.arc(pp.x, pp.y, toolRadius / scaler, 0, 2 * Math.PI, !0), tp.fill(), tp.stroke() },
        drawOrigin = function(e) { po = projection({ x: 0, y: 0, z: 0 }), tp.beginPath(), tp.strokeStyle = "red", tp.arc(po.x, po.y, e, 0, 2 * Math.PI, !1), tp.moveTo(1.5 * -e, 0), tp.lineTo(1.5 * e, 0), tp.moveTo(0, 1.5 * -e), tp.lineTo(0, 1.5 * e), tp.stroke() },
        drawMachineBounds = function() {
            var e = MPOS[0] - WPOS[0],
                t = MPOS[1] - WPOS[1],
                n = 0;
            yMin = 1 == yHomeDir ? yHomePos - yMaxTravel : yHomePos;
            var a = (n = 1 == xHomeDir ? xHomePos - xMaxTravel : xHomePos) + xMaxTravel,
                i = yMin + yMaxTravel,
                o = projection({ x: n - e, y: yMin - t, z: 0 }),
                n = projection({ x: n - e, y: i - t, z: 0 }),
                i = projection({ x: a - e, y: i - t, z: 0 }),
                t = projection({ x: a - e, y: yMin - t, z: 0 });
            tpBbox.min.x = Math.min(tpBbox.min.x, o.x), tpBbox.min.y = Math.min(tpBbox.min.y, o.y), tpBbox.max.x = Math.max(tpBbox.max.x, i.x), tpBbox.max.y = Math.max(tpBbox.max.y, i.y), bboxIsSet = !0, tp.beginPath(), tp.moveTo(o.x, o.y), tp.lineTo(o.x, o.y), tp.lineTo(n.x, n.y), tp.lineTo(i.x, i.y), tp.lineTo(t.x, t.y), tp.lineTo(o.x, o.y), tp.strokeStyle = "green", tp.stroke()
        },
        xOffset = 0,
        yOffset = 0,
        scaler = 1,
        xToPixel = function(e) { return scaler * e + xOffset },
        yToPixel = function(e) { return -scaler * e + yOffset },
        clearCanvas = function() {
            tp.setTransform(1, 0, 0, 1, 0, 0);
            var e = canvas.parentNode.getBoundingClientRect();
            canvas.width = e.width || 400, canvas.height = e.height || 400, tp.fillStyle = "white", tp.fillRect(0, 0, canvas.width, canvas.height)
        },
        transformCanvas = function() {
            if (toolSave = null, clearCanvas(), !bboxIsSet) return scaler = 1, void(yOffset = xOffset = n = 0);
            var e = tpBbox.max.x - tpBbox.min.x,
                t = tpBbox.max.y - tpBbox.min.y,
                n = 5,
                a = (canvas.width - 2 * n) / (e = 0 == e ? 1 : e),
                i = (canvas.height - 2 * n) / (t = 0 == t ? 1 : t),
                i = Math.min(a, i);
            (scaler = .9 * i) < 0 && (scaler = -scaler), xOffset = n - tpBbox.min.x * scaler, yOffset = canvas.height - n - tpBbox.min.y * -scaler;
            tp.setTransform(scaler, 0, 0, -scaler, xOffset, yOffset), tp.lineWidth = .5 / scaler, drawOrigin(.04 * e)
        },
        wrappedDegrees = function(e) { e = 180 * e / Math.PI; return 0 <= e ? e : 360 + e },
        bboxHandlers = {
            addLine: function(e, t, n) { tpUnits = e.units, ps = projection(t), pe = projection(n), tpBbox.min.x = Math.min(tpBbox.min.x, ps.x, pe.x), tpBbox.min.y = Math.min(tpBbox.min.y, ps.y, pe.y), tpBbox.max.x = Math.max(tpBbox.max.x, ps.x, pe.x), tpBbox.max.y = Math.max(tpBbox.max.y, ps.y, pe.y), bboxIsSet = !0 },
            addArcCurve: function(e, t, n, a, i) {
                tpUnits = e.units, "G2" == e.motion && (c = t, t = n, n = c), ps = projection(t), pc = projection(a), pe = projection(n);
                var o = ps.x - pc.x,
                    r = ps.y - pc.y,
                    s = pe.x - pc.x,
                    l = pe.y - pc.y,
                    e = Math.hypot(o, r),
                    c = !1,
                    t = !1,
                    a = !1,
                    n = !1;
                0 <= l ? 0 < s ? 0 <= r ? 0 < o ? o <= s && (c = t = a = n = !0) : a = n = c = !0 : 0 < o ? c = !0 : n = c = !0 : 0 <= r ? 0 < o ? t = !0 : o <= s && (c = t = a = n = !0) : 0 < o ? c = t = !0 : n = c = t = !0 : 0 < s ? 0 <= r ? 0 < o ? t = a = n = !0 : a = n = !0 : 0 < o ? s <= o && (c = t = a = n = !0) : n = !0 : 0 <= r ? 0 < o ? t = a = !0 : a = !0 : 0 < o ? c = t = a = !0 : s <= o && (c = t = a = n = !0);
                c = c ? pc.x + e : Math.max(ps.x, pe.x), t = t ? pc.y + e : Math.max(ps.y, pe.y), a = a ? pc.x - e : Math.min(ps.x, pe.x), e = n ? pc.y - e : Math.min(ps.y, pe.y);
                tpBbox.min.x = Math.min(tpBbox.min.x, a), tpBbox.min.y = Math.min(tpBbox.min.y, e), tpBbox.max.x = Math.max(tpBbox.max.x, c), tpBbox.max.y = Math.max(tpBbox.max.y, t), bboxIsSet = !0
            }
        },
        initialMoves = !0,
        displayHandlers = {
            addLine: function(e, t, n) { "G0" == e.motion ? tp.strokeStyle = initialMoves ? "red" : "green" : (tp.strokeStyle = "blue", t.x == n.x && t.y == n.y || (initialMoves = !1)), ps = projection(t), pe = projection(n), tp.beginPath(), tp.moveTo(ps.x, ps.y), tp.lineTo(pe.x, pe.y), tp.stroke() },
            addArcCurve: function(e, t, a, o, r) {
                e.motion;
                var s = t.x - o.x,
                    l = t.y - o.y,
                    c = Math.hypot(s, l),
                    d = a.x - o.x,
                    u = a.y - o.y,
                    s = Math.atan2(l, s),
                    d = Math.atan2(u, d),
                    e = "G2" == e.motion;
                for (!e && d < s ? d += 2 * Math.PI : e && s < d && (d -= 2 * Math.PI), s == d && (d += Math.PI * (e ? -2 : 2)), 1 < r && (d += (r - 1) * Math.PI * (e ? -2 : 2)), initialMoves = !1, tp.beginPath(), tp.strokeStyle = "blue", deltaTheta = d - s, n = 10 * Math.ceil(Math.abs(deltaTheta) / Math.PI), dt = deltaTheta / n, dz = (a.z - t.z) / n, ps = projection(t), tp.moveTo(ps.x, ps.y), next = {}, theta = s, next.z = t.z, i = 0; i < n; i++) theta += dt, next.x = o.x + c * Math.cos(theta), next.y = o.y + c * Math.sin(theta), next.z += dz, pe = projection(next), tp.lineTo(pe.x, pe.y);
                tp.stroke()
            }
        },
        ToolpathDisplayer = function() {};
    ToolpathDisplayer.prototype.clear = function() { clearCanvas() }, ToolpathDisplayer.prototype.showToolpath = function(e, t, n) {
        var a = !1;
        switch (cameraAngle) {
            case 0:
                obliqueView();
                break;
            case 1:
                obliqueView(), a = !0;
                break;
            case 2:
                topView();
                break;
            case 3:
                topView(), a = !0;
                break;
            default:
                obliqueView()
        }
        resetBbox(), bboxHandlers.position = n, bboxHandlers.modal = t, a && drawMachineBounds();
        e = e.split("\n");
        new Toolpath(bboxHandlers).loadFromLinesSync(e), transformCanvas(), bboxIsSet && (initialMoves = !0, displayHandlers.position = n, displayHandlers.modal = t, new Toolpath(displayHandlers).loadFromLinesSync(e), drawTool(n), a && drawMachineBounds())
    }, ToolpathDisplayer.prototype.reDrawTool = function(e, t) { null != toolSave && (tp.putImageData(toolSave, toolX, toolY), drawTool(t)) }, ToolpathDisplayer.prototype.setXTravel = function(e) { xMaxTravel = e }, ToolpathDisplayer.prototype.setYTravel = function(e) { yMaxTravel = e }, ToolpathDisplayer.prototype.setXHome = function(e) { xHomePos = e }, ToolpathDisplayer.prototype.setYHome = function(e) { yHomePos = e }, ToolpathDisplayer.prototype.setXDir = function(e) { xHomeDir = "true" == e ? 1 : -1 }, ToolpathDisplayer.prototype.setYDir = function(e) { yHomeDir = "true" == e ? 1 : -1 }, displayer = new ToolpathDisplayer, ToolpathDisplayer.prototype.cycleCameraAngle = function(e, t, n) { 3 < (cameraAngle += 1) && (cameraAngle = 0), displayer.showToolpath(e, t, n) }, canvas.addEventListener("mouseup", updateGcodeViewerAngle);
    var language = "en",
        language_list = [
            ["en", "English", "englishtrans"]
        ];

    function build_language_list(e) { for (var t = "<select class='form-control'  id='" + e + "' onchange='translate_text(this.value)'>\n", n = 0; n < language_list.length; n++) t += "<option value='" + language_list[n][0] + "'", language_list[n][0] == language && (t += " selected"), t += ">" + language_list[n][1] + "</option>\n"; return t += "</select>\n" }

    function translate_text(lang) {
        var currenttrans = {},
            translated_content = "";
        language = lang;
        for (var lang_i = 0; lang_i < language_list.length; lang_i++) language_list[lang_i][0] == lang && (currenttrans = eval(language_list[lang_i][2]));
        for (var All = document.getElementsByTagName("*"), i = 0, content, content; i < All.length; i++) { All[i].hasAttribute("translate") && (content = "", All[i].hasAttribute("english_content") || (content = All[i].innerHTML, content.trim(), All[i].setAttribute("english_content", content)), content = All[i].getAttribute("english_content"), translated_content = translate_text_item(content), All[i].innerHTML = translated_content), All[i].hasAttribute("translateph") && All[i].hasAttribute("placeholder") && (content = "", All[i].hasAttribute("english_content") || (content = All[i].getAttribute("placeholder"), content.trim(), All[i].setAttribute("english_content", content)), content = All[i].getAttribute("english_content"), translated_content = decode_entitie(translate_text_item(content)), All[i].setAttribute("placeholder", translated_content)) }
    }

    function translate_text_item(item_text, withtag) {
        var currenttrans = {},
            translated_content, with_tag = !1;
        void 0 !== withtag && (with_tag = withtag);
        for (var lang_i = 0, translated_content_tmp, translated_content; lang_i < language_list.length; lang_i++) language_list[lang_i][0] == language && (currenttrans = eval(language_list[lang_i][2]));
        return translated_content = currenttrans[item_text], void 0 === translated_content && (translated_content = item_text), with_tag && (translated_content_tmp = '<span english_content="' + item_text + '" translate>' + translated_content + "</span>", translated_content = translated_content_tmp), translated_content
    }
    var update_ongoing = !1,
        current_update_filename = "";

    function updatedlg() { null != setactiveModal("updatedlg.html") && (id("fw_file_name").innerHTML = translate_text_item("No file chosen"), displayNone("prgfw"), displayNone("uploadfw-button"), id("updatemsg").innerHTML = "", id("fw-select").value = "", id("fw_update_dlg_title").innerHTML = translate_text_item("ESP3D Update").replace("ESP3D", "Bantam Tools Pen Plotter"), showModal()) }

    function closeUpdateDialog(e) { update_ongoing ? alertdlg(translate_text_item("Busy..."), translate_text_item("Update is ongoing, please wait and retry.")) : closeModal(e) }

    function checkupdatefile() {
        var e, t = id("fw-select").files;
        displayNone("updatemsg"), (0 == t.length ? displayNone : displayBlock)("uploadfw-button"), 0 < t.length ? 1 == t.length ? id("fw_file_name").innerHTML = t[0].name : (e = translate_text_item("$n files"), id("fw_file_name").innerHTML = e.replace("$n", t.length)) : id("fw_file_name").innerHTML = translate_text_item("No file chosen")
    }

    function UpdateProgressDisplay(e) { e.lengthComputable && (e = e.loaded / e.total * 100, id("prgfw").value = e, id("updatemsg").innerHTML = translate_text_item("Uploading ") + current_update_filename + " " + e.toFixed(0) + "%") }

    function UploadUpdatefile() { confirmdlg(translate_text_item("Please confirm"), translate_text_item("Update Firmware ?"), StartUploadUpdatefile) }

    function StartUploadUpdatefile(e) {
        if ("yes" == e)
            if (http_communication_locked) alertdlg(translate_text_item("Busy..."), translate_text_item("Communications are currently locked, please wait and retry."));
            else {
                for (var t = id("fw-select").files, n = new FormData, a = 0; a < t.length; a++) {
                    var i = t[a],
                        o = "/" + i.name + "S";
                    n.append(o, i.size), n.append("myfile[]", i, "/" + i.name)
                }
                displayNone("fw-select_form"), displayNone("uploadfw-button"), update_ongoing = !0, displayBlock("updatemsg"), displayBlock("prgfw"), current_update_filename = 1 == t.length ? t[0].name : "", id("updatemsg").innerHTML = translate_text_item("Uploading ") + current_update_filename, SendFileHttp("/updatefw", n, UpdateProgressDisplay, updatesuccess, updatefailed)
            }
    }

    function updatesuccess(e) {
        id("updatemsg").innerHTML = translate_text_item("Restarting, please wait...."), id("fw_file_name").innerHTML = "";
        var t, n = 0;
        id("prgfw").max = 10, t = setInterval(function() {
            n += 1;
            var e = id("prgfw");
            e.value = n, id("updatemsg").innerHTML = translate_text_item("Restarting, please wait....") + (41 - n) + translate_text_item(" seconds"), n > e.max && (update_ongoing = !1, clearInterval(t), location.reload())
        }, 1e3)
    }

    function updatefailed(e, t) { displayBlock("fw-select_form"), displayNone("prgfw"), id("fw_file_name").innerHTML = translate_text_item("No file chosen"), displayNone("uploadfw-button"), id("fw-select").value = "", 0 != esp_error_code ? (alertdlg(translate_text_item("Error") + " (" + esp_error_code + ")", esp_error_message), id("updatemsg").innerHTML = translate_text_item("Upload failed : ") + esp_error_message, esp_error_code = 0) : (alertdlg(translate_text_item("Error"), "Error " + e + " : " + t), id("updatemsg").innerHTML = translate_text_item("Upload failed : ") + e + " :" + t), console.log("Error " + e + " : " + t), update_ongoing = !1, SendGetHttp("/updatefw") }

    function id(e) { return document.getElementById(e) }

    function classes(e) { return Array.from(document.getElementsByClassName(e)) }

    function setValue(e, t) { id(e).value = t }

    function getValue(e, t) { return id(e).value }

    function intValue(e) { return parseInt(getValue(e)) }

    function getTextContent(e, t) { return id(e).textContent }

    function setTextContent(e, t) { id(e).textContent = t }

    function setHTML(e, t) { id(e).innerHTML = t }

    function setText(e, t) { id(e).innerText = t }

    function getText(e) { return id(e).innerText }

    function setDisplay(e, t) { id(e).style.display = t }

    function displayNone(e) { setDisplay(e, "none") }

    function displayBlock(e) { setDisplay(e, "block") }

    function displayFlex(e) { setDisplay(e, "flex") }

    function displayTable(e) { setDisplay(e, "table-row") }

    function displayInline(e) { setDisplay(e, "inline") }

    function displayInitial(e) { setDisplay(e, "initial") }

    function displayUndoNone(e) { setDisplay(e, "") }

    function setVisible(e) { id("SPIFFS_loader").style.visibility = "visible" }

    function setHidden(e) { id("SPIFFS_loader").style.visibility = "hidden" }

    function setDisabled(e, t) { id(e).disabled = t }

    function selectDisabled(e, t) { document.querySelectorAll(e).forEach(function(e) { e.disabled = t }) }

    function click(e) { id(e).click() }

    function files(e) { return id(e).files }

    function setChecked(e, t) { id(e).checked = t }

    function getChecked(e) { return id(e).checked }
    var can_revert_wizard = !1;

    function openstep(e, t) {
        var n, a, i;
        if (!(-1 < e.currentTarget.className.indexOf("wizard_done")) || can_revert_wizard) {
            for (a = classes("stepcontent"), n = 0; n < a.length; n++) a[n].style.display = "none";
            for (i = classes("steplinks"), n = 0; n < i.length; n++) i[n].className = i[n].className.replace(" active", "");
            displayBlock(t), e.currentTarget.className += " active"
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        var buttons = document.getElementsByClassName("distButton");
        for(let i=0; i<buttons.length; i++) {
            buttons[i].addEventListener('click', function() {
                var currentlySelected = document.querySelector('.distButton.selected');
                if(currentlySelected) {
                    currentlySelected.classList.remove('selected');
                }
                this.classList.add('selected');
                if(this.id === 'distbutton1'){
                    jogStep = 0.1;
                } else if (this.id === 'distbutton2'){
                    jogStep = 1;
                } else if (this.id === 'distbutton3'){
                    jogStep = 10;
                } else if (this.id === 'distbutton4'){
                    jogStep = 100;
                }
                console.log('Jog step set to '+ jogStep);
            });
        }
    });
    

    var englishtrans = { en: "English", STA: "Client Station", AP: "Access Point", BT: "Bluetooth", "Hold:0": "Hold complete. Ready to resume.", "Hold:1": "Hold in-progress. Reset will throw an alarm.", "Door:0": "Door closed. Ready to resume.", "Door:1": "Machine stopped. Door still ajar. Can't resume until closed.", "Door:2": "Door opened. Hold (or parking retract) in-progress. Reset will throw an alarm.", "Door:3": "Door closed and resuming. Restoring from park, if applicable. Reset will throw an alarm.", "ALARM:1": "Hard limit has been triggered. Machine position is likely lost due to sudden halt. Re-homing is highly recommended.", "ALARM:2": "Soft limit alarm. G-code motion target exceeds machine travel. Machine position retained. Alarm may be safely unlocked, click the Reset Button.", "ALARM:3": "Reset while in motion. Machine position is likely lost due to sudden halt. Re-homing is highly recommended.", "ALARM:4": "Probe fail. Probe is not in the expected initial state before starting probe cycle.", "ALARM:5": "Probe fail. Probe did not contact the workpiece within the programmed travel for G38.2 and G38.4.", "ALARM:6": "Homing fail. The active homing cycle was reset.", "ALARM:7": "Homing fail. Safety door was opened during homing cycle.", "ALARM:8": "Homing fail. Pull off travel failed to clear limit switch. Try increasing pull-off setting or check wiring.", "ALARM:9": "Homing fail. Could not find limit switch within search distances. Try increasing max travel, decreasing pull-off distance, or check wiring.", "error:1": "G-code words consist of a letter and a value. Letter was not found.", "error:2": "Missing the expected G-code word value or numeric value format is not valid.", "error:3": "Grbl '$' system command was not recognized or supported.", "error:4": "Negative value received for an expected positive value.", "error:5": "Homing cycle failure. Homing is not enabled via settings.", "error:6": "Minimum step pulse time must be greater than 3usec.", "error:7": "An EEPROM read failed. Auto-restoring affected EEPROM to default values.", "error:8": "Grbl '$' command cannot be used unless Grbl is IDLE. Ensures smooth operation during a job.", "error:9": "G-code commands are locked out during alarm or jog state.", "error:10": "Soft limits cannot be enabled without homing also enabled.", "error:11": "Max characters per line exceeded. Received command line was not executed.", "error:12": "Grbl '$' setting value cause the step rate to exceed the maximum supported.", "error:13": "Safety door detected as opened and door state initiated.", "error:14": "Build info or startup line exceeded EEPROM line length limit. Line not stored.", "error:15": "Jog target exceeds machine travel. Jog command has been ignored.", "error:16": "Jog command has no '=' or contains prohibited g-code.", "error:17": "Laser mode requires PWM output.", "error:20": "Unsupported or invalid g-code command found in block.", "error:21": "More than one g-code command from same modal group found in block.", "error:22": "Feed rate has not yet been set or is undefined.", "error:23": "G-code command in block requires an integer value.", "error:24": "More than one g-code command that requires axis words found in block.", "error:25": "Repeated g-code word found in block.", "error:26": "No axis words found in block for g-code command or current modal state which requires them.", "error:27": "Line number value is invalid.", "error:28": "G-code command is missing a required value word.", "error:29": "G59.x work coordinate systems are not supported.", "error:30": "G53 only allowed with G0 and G1 motion modes.", "error:31": "Axis words found in block when no command or current modal state uses them.", "error:32": "G2 and G3 arcs require at least one in-plane axis word.", "error:33": "Motion command target is invalid.", "error:34": "Arc radius value is invalid.", "error:35": "G2 and G3 arcs require at least one in-plane offset word.", "error:36": "Unused value words found in block.", "error:37": "G43.1 dynamic tool length offset is not assigned to configured tool length axis.", "error:38": "Tool number greater than max supported value.", "error:60": "SD failed to mount", "error:61": "SD card failed to open file for reading", "error:62": "SD card failed to open directory", "error:63": "SD Card directory not found", "error:64": "SD Card file empty", "error:70": "Bluetooth failed to start" },
        fltrans = { "ESP3D Filesystem": "FluidNC Local Filesystem", "ESP3D Settings": "FluidNC Settings", "ESP3D Status": "FluidNC Status", "Restart ESP3D": "Restart FluidNC", "Restarting ESP3D": "Restarting FluidNC", fl: "English FluidNC", STA: "Client Station", AP: "Access Point", BT: "Bluetooth", "Hold:0": "Hold complete. Ready to resume.", "Hold:1": "Hold in-progress. Reset will throw an alarm.", "Door:0": "Door closed. Ready to resume.", "Door:1": "Machine stopped. Door still ajar. Can't resume until closed.", "Door:2": "Door opened. Hold (or parking retract) in-progress. Reset will throw an alarm.", "Door:3": "Door closed and resuming. Restoring from park, if applicable. Reset will throw an alarm.", "ALARM:1": "Hard limit has been triggered. Machine position is likely lost due to sudden halt. Re-homing is highly recommended.", "ALARM:2": "Soft limit alarm. G-code motion target exceeds machine travel. Machine position retained. Alarm may be safely unlocked, click the Reset Button.", "ALARM:3": "Reset while in motion. Machine position is likely lost due to sudden halt. Re-homing is highly recommended.", "ALARM:4": "Probe fail. Probe is not in the expected initial state before starting probe cycle.", "ALARM:5": "Probe fail. Probe did not contact the workpiece within the programmed travel for G38.2 and G38.4.", "ALARM:6": "Homing fail. The active homing cycle was reset.", "ALARM:7": "Homing fail. Safety door was opened during homing cycle.", "ALARM:8": "Homing fail. Pull off travel failed to clear limit switch. Try increasing pull-off setting or check wiring.", "ALARM:9": "Homing fail. Could not find limit switch within search distances. Try increasing max travel, decreasing pull-off distance, or check wiring.", "error:1": "G-code words consist of a letter and a value. Letter was not found.", "error:2": "Missing the expected G-code word value or numeric value format is not valid.", "error:3": "Grbl '$' system command was not recognized or supported.", "error:4": "Negative value received for an expected positive value.", "error:5": "Homing cycle failure. Homing is not enabled via settings.", "error:6": "Minimum step pulse time must be greater than 3usec.", "error:7": "An EEPROM read failed. Auto-restoring affected EEPROM to default values.", "error:8": "Grbl '$' command cannot be used unless Grbl is IDLE. Ensures smooth operation during a job.", "error:9": "G-code commands are locked out during alarm or jog state.", "error:10": "Soft limits cannot be enabled without homing also enabled.", "error:11": "Max characters per line exceeded. Received command line was not executed.", "error:12": "Grbl '$' setting value cause the step rate to exceed the maximum supported.", "error:13": "Safety door detected as opened and door state initiated.", "error:14": "Build info or startup line exceeded EEPROM line length limit. Line not stored.", "error:15": "Jog target exceeds machine travel. Jog command has been ignored.", "error:16": "Jog command has no '=' or contains prohibited g-code.", "error:17": "Laser mode requires PWM output.", "error:20": "Unsupported or invalid g-code command found in block.", "error:21": "More than one g-code command from same modal group found in block.", "error:22": "Feed rate has not yet been set or is undefined.", "error:23": "G-code command in block requires an integer value.", "error:24": "More than one g-code command that requires axis words found in block.", "error:25": "Repeated g-code word found in block.", "error:26": "No axis words found in block for g-code command or current modal state which requires them.", "error:27": "Line number value is invalid.", "error:28": "G-code command is missing a required value word.", "error:29": "G59.x work coordinate systems are not supported.", "error:30": "G53 only allowed with G0 and G1 motion modes.", "error:31": "Axis words found in block when no command or current modal state uses them.", "error:32": "G2 and G3 arcs require at least one in-plane axis word.", "error:33": "Motion command target is invalid.", "error:34": "Arc radius value is invalid.", "error:35": "G2 and G3 arcs require at least one in-plane offset word.", "error:36": "Unused value words found in block.", "error:37": "G43.1 dynamic tool length offset is not assigned to configured tool length axis.", "error:38": "Tool number greater than max supported value.", "error:60": "SD failed to mount", "error:61": "SD card failed to open file for reading", "error:62": "SD card failed to open directory", "error:63": "SD Card directory not found", "error:64": "SD Card file empty", "error:70": "Bluetooth failed to start" },
        frenchtrans = { fr: "Fran&ccedil;ais", "ESP3D for": "ESP3D pour", "Value of auto-check must be between 0s and 99s !!": "La valeur de contr&ocirc;le doit &ecirc;tre entre 0s et 99s !!", "Value of extruder velocity must be between 1 mm/min and 9999 mm/min !": "La valeur de vitesse d'extrusion doit &ecirc;tre entre 1 mm/min et 9999 mm/min !", "Value of filament length must be between 0.001 mm and 9999 mm !": "La valeur de distance d'extrusion doit &ecirc;tre entre 0.001 mm et 9999 mm !", "cannot have '-', '#' char or be empty": "ne peut contenir les carat&egrave;res '-', '#'  ou &ecirc;tre vide", "cannot have '-', 'e' char or be empty": "ne peut contenir les carat&egrave;res '-', 'e'  ou &ecirc;tre vide", "Failed:": "Echec", "File config / config.txt not found!": "Fichier config / config.txt non trouv&egrave;", "File name cannot be empty!": "Le nom de fichier ne peut &ecirc;tre vide", "Value must be ": "La valeur doit &ecirc;tre ", "Value must be between 0 degres and 999 degres !": "La valeur doit &ecirc;tre entre 0 degr&egrave;s et 999 degr&egrave;s !", "Value must be between 0% and 100% !": "La valeur doit &ecirc;tre entre 0% et 100% !", "Value must be between 25% and 150% !": "La valeur doit &ecirc;tre entre 25% et 150% !", "Value must be between 50% and 300% !": "La valeur doit &ecirc;tre entre 50% et 300%", "XY feedrate value must be between 1 mm/min and 9999 mm/min !": "La valeur de l'acc&eacute;l&eacute;ration XY doit &ecirc;tre entre 1mm/min et 999mm/min !", "Z feedrate value must be between 1 mm/min and 999 mm/min !": "La valeur de l'acc&eacute;l&eacute;ration Z doit &ecirc;tre entre 1mm/min et 999mm/min !", " seconds": " secondes", Abort: "Stopper", "auto-check every:": "Contr&ocirc;le toutes les:", "auto-check position every:": "Contr&ocirc;le position toutes les:", Autoscroll: "D&eacute;filement auto", Redundant: "Redundant", Probe: "Probe", Bed: "Plateforme", Chamber: "Chamber", Board: "Carte", "Busy...": "Indisponible...", Camera: "Cam&eacute;ra", Cancel: "Annuler", "Cannot get EEPROM content!": "Impossible d'obtenir le contenu de l'EEPROM", Clear: "Effacer", Close: "Fermer", Color: "Couleur", Commands: "Commandes", "Communication locked by another process, retry later.": "Communication bloqu&eacute;e par un autre processus, essayez plus tard.", "Communication locked!": "Communication bloqu&eacute;e!", "Communications are currently locked, please wait and retry.": "Les communications sont actuellement bloqu&eacute;e, r&eacute;&eacute;ssayez plus tard!", "Confirm deletion of directory: ": "Confirmez l'&eacute;ffacement du r&eacute;pertoire: ", "Confirm deletion of file: ": "Confirmez l'&eacute;ffacement du fichier: ", "Connecting ESP3D...": "Connexion &agrave; ESP3D", "Connection failed! is your FW correct?": "Impossible de se connecter! V&eacute;rifiez le micrologiciel", Controls: "Controles", Credits: "Cr&eacute;dits", Dashboard: "Tableau de bord", "Data mofified": "Donn&eacute;es modifi&eacute;es", "Do you want to save?": "Voulez-vous enregister?", "Enable second extruder controls": "Activer le controle du second extrudeur", Error: "Erreur", "ESP3D Filesystem": "Fichiers ESP3D", "ESP3D Settings": "Param&egrave;tres ESP3D", "ESP3D Status": "Etat ESP3D", "ESP3D Update": "Mise &agrave; jour ESP3D", Extrude: "Extrusion", "Extruder T0": "Extrudeur T0", "Extruder T1": "Extrudeur T1", Extruders: "Extrudeurs", "Fan (0-100%)": "Ventilateur (0-100%)", "Feed (25-150%)": "Vitesse (25-150%)", "Feedrate :": "Acc&eacute;l&eacute;ration :", Filename: "Fichier", "Filename/URI": "Fichier/URI", "Verbose mode": "Mode dl&eacute;tailll&eacute;", Firmware: "Micrologiciel", "Flow (50-300%)": "D&eacute;bit (50-300%)", "Heater T0": "Chauffage T0", "Heater T1": "Chauffage T1", Help: "Aide", Icon: "Icone", Interface: "Interface", Join: "Connecter", Label: "Intitul&eacute;", "List of available Access Points": "Points d'acc&egrave;s disponibles", "Macro Editor": "Editeur de macro", mm: "mm", "mm/min": "mm/min", "Motors off": "Arr&ecirc;t Moteurs", Name: "Nom", "Name:": "Nom:", Network: "R&eacute;seau", "No SD card detected": "Pas de SD carte d&eacute;tect&eacute;e", No: "Non", "Occupation:": "Occupation", Ok: "Ok", Options: "Options", "Out of range": "Invalide", "Please Confirm": "SVP Confirmez", "Please enter directory name": "Entrez le nom du r&eacute;pertoire", "Please wait...": "Patientez...", "Printer configuration": "Configuration imprimante", "GRBL configuration": "Configuration GRBL", Printer: "Imprimante", Progress: "Progression", Protected: "Prot&eacute;g&eacute;", Refresh: "Actualiser", "Restart ESP3D": "Red&eacute;marrage ESP3D", "Restarting ESP3D": "Red&eacute;marrage ESP3D", Restarting: "Red&eacute;marrage", "Restarting, please wait....": "Red&eacute;marrage, patientez...", Retry: "R&eacute;&eacute;ssayer", Reverse: "Annuler", "Save macro list failed!": "Echec enregistrement des macros", Save: "Enregistrer", Saving: "Enregistrement", Scanning: "Recherche", "SD Files": "Fichiers de carte SD", sec: "sec", "Send Command...": "Envoi Commande...", Send: "Envoyer", "Set failed": "Echec enregistrement", Set: "Enregister", Signal: "Signal", Size: "Taille", SSID: "Identifiant", Target: "Emplacement", Temperatures: "Temp&eacute;ratures", "Total:": "Total:", Type: "Type", "Update Firmware ?": "MAJ Micrologiciel ?", "Update is ongoing, please wait and retry.": "Mise &agrave; jour en cours, SVP attendez et r&eacute;essayez.", Update: "Mise &agrave; jour", "Upload failed : ": "T&eacute;l&eacute;chargement annul&eacute;", "Upload failed": "T&eacute;l&eacute;chargement annul&eacute;", Upload: "T&eacute;l&eacute;chargement", "Uploading ": "T&eacute;l&eacute;chargement ", "Upload done": "T&eacute;l&eacute;chargement termin&eacute;", "Used:": "Utilis&eacute;:", "Value | Target": "Actuel | Objectif", Value: "Valeur", "Wrong data": "Donn&eacute;es invalides", Yes: "Oui", Light: "Automatique", None: "Aucun", Modem: "Modem", STA: "Client", AP: "Point d'acc&egrave;s", "Baud Rate": "Vitesse de communication", "Sleep Mode": "Mode de veille", "Web Port": "Port internet", "Data Port": "Port de donn&eacute;es", Hostname: "Nom du serveur", "Wifi mode": "Mode WiFi", "Station SSID": "Identifiant r&eacute;seau WiFi du client", "Station Password": "Mot de passe WiFi du client", "Station Network Mode": "Type de r&eacute;seau client", "Station IP Mode": "Mode IP client", DHCP: "Dynamique", Static: "Statique", "Station Static IP": "IP fixe client", "Station Static Mask": "Masque de sous-r&eacute;seau client", "Station Static Gateway": "Gateway client", "AP SSID": "Identifiant r&eacute;seau WiFi du point d'acc&egrave;s", "AP Password": "Mot de passe WiFi du point d'acc&egrave;s", "AP Network Mode": "Type de r&eacute;seau du point d'acc&egrave;s", "SSID Visible": "R&eacute;seau Visible", "AP Channel": "Canal du point d'acc&egrave;s", Open: "Ouvert", Authentication: "Authentification", "AP IP Mode": "Mode IP point d'acc&egrave;s", "AP Static IP": "IP fixe du point d'acc&egrave;s", "AP Static Mask": "Masque de sous-r&eacute;seau du point d'acc&egrave;s", "AP Static Gateway": "Gateway du point d'acc&egrave;s", "Time Zone": "Fuseau horaire", "Day Saving Time": "Heure d'&eacute;t&eacute;", "Time Server 1": "Serveur NTP 1", "Time Server 2": "Serveur NTP 2", "Time Server 3": "Serveur NTP 3", "Target FW": "Firmware cible", "Direct SD access": "Connexion directe sur lecteur SD", "Direct SD Boot Check": "Controle direct du lecteur SD au d&eacute;marrage", "Primary SD": "Lecteur SD connect&eacute;", "Secondary SD": "Lecteur SD scondaire", "Temperature Refresh Time": "P&eacute;riode de controle de temp&eacute;rature", "Position Refresh Time": "P&eacute;riode de controle de position", "Status Refresh Time": "P&eacute;riode de controle d'&eacute;tat", "XY feedrate": "Acc&eacute;l&eacute;ration XY", "Z feedrate": "Acc&eacute;l&eacute;ration Z", "E feedrate": "Acc&eacute;l&eacute;ration E", "Camera address": "Adresse cam&eacute;ra", Setup: "Configuration", "Start setup": "D&egrave;marrer la configuration", "This wizard will help you to configure the basic settings.": "Cet assistant va vous aider &agrave; d&eacute;finir les param&egrave;tres de base.", "Press start to proceed.": "Appuyez d&eacute;marrer pour commencer.", "Save your printer's firmware base:": "Enregistrez le firmware de base de l'imprimante", "This is mandatory to get ESP working properly.": "Ceci est indispensable pour le bon fonctionnement de ESP3D.", "Save your printer's board current baud rate:": "Enregistrez la vitesse de communication de votre imprimante:", "Printer and ESP board must use same baud rate to communicate properly.": "Imprimante et ESP3D doivent communiquer &agrave; la m&ecirc;me vitesse.", Continue: "Continuer", "WiFi Configuration": "Configuration WiFi", "Define ESP role:": "D&eacute;finir le role de ESP3D:", "AP define access point / STA allows to join existing network": "Point d'acc&egrave;s ou client d'un reseau existant.", "What access point ESP need to be connected to:": "D&eacute;finir le point d'acc&egrave;s auquel ESP3D se connecte:", "You can use scan button, to list available access points.": "Vous pouvez visualiser les points d'acc&egrave;s disponibles en appuyant le bouton recherche.", "Password to join access point:": "Mot de passe du point d'acc&egrave;s:", "Define ESP name:": "D&eacute;finir le nom r&eacute;seau de ESP3D:", "What is ESP access point SSID:": "D&eacute;finir l'identifiant du point d'acc&egrave;s ESP3D:", "Password for access point:": "Mot de passe du point d'acc&egrave;s:", "Define security:": "D&eacute;finir le type de protection:", "SD Card Configuration": "Configuration Carte SD", "Is ESP connected to SD card:": "ESP3D est directement connect&eacute;e au lecteur SD:", "Check update using direct SD access:": "Controle direct du lecteur SD au d&eacute;marrage:", "SD card connected to ESP": "Lecteur SD directement connect&eacute; &agrave; ESP", "SD card connected to printer": "Lecteur SD Secondaire", "Setup is finished.": "Configuration termin&eacute;e.", "After closing, you will still be able to change or to fine tune your settings in main interface anytime.": "Apr&egrave;s la fermeture de la boite de dialogue, vous pourrez toujours modifier les param&egrave;tres dans l'interface principale.", "You may need to restart the board to apply the new settings and connect again.": "Il est possible qu'un red&eacute;marrage de la carte et une nouvelle connection &agrave; l'interface soit n&eacute;cessaire pour appliquer/visualiser les modifications.", "Identification requested": "Identification requise", admin: "administrateur", user: "utilisateur", guest: "invit&eacute;", "Identification invalid!": "Identification invalide!", "Passwords do not matches!": "Les mots de passe ne correspondent pas!", "Password must be >1 and <16 without space!": "Le mot de passe doit avoir une taile >1 et <16 et sans espace!", "User:": "Utilisateur:", "Password:": "Mot de passe:", Submit: "Soumettre", "Change Password": "Changement de  mot de passe", "Current Password:": "Mot de passe actuel:", "New Password:": "Nouveau mot de passe:", "Confirm New Password:": "Confirmation mot de passe:", "Error : Incorrect User": "Erreur : Utilisateur inconnu", "Error: Incorrect password": "Erreurr: Mot de passe invalide", "Error: Missing data": "Erreur: Donn&eacute;es incorrectes", "Error: Cannot apply changes": "Erreur: Modifications impossible", "Error: Too many connections": "Erreurr: Trop de connexions", "Authentication failed!": "Echec de l'identification !", "Serial is busy, retry later!": "Port s&eacute;rie satur&eacute;, essayez plus tard!", Login: "Connexion", "Log out": "D&eacute;connexion", Password: "Mot de passe", "No SD Card": "Pas de Carte SD", "Check for Update": "V&eacute;rification de MAJ au d&eacute;marrage", "Please use 8.3 filename only.": "Utilisez des noms de fichier au format 8.3 uniquement.", Preferences: "Pr&eacute;f&eacute;rences", Feature: "Fonctions", "Show camera panel": "Afficher le controle de la cam&eacute;ra", "Auto load camera": "Automatiquement d&eacute;marrer la cam&eacute;ra", "Enable heater T0 redundant temperatures": "Enable heater T0 redundant temperatures", "Enable probe temperatures": "Enable probe temperatures", "Enable bed controls": "Activer les controles de la plateforme", "Enable chamber controls": "Enable chamber controls", "Enable fan controls": "Activer les controles du ventilateur", "Enable Z controls": "Activer les controles de l'axe Z", Panels: "Panneaux", "Show control panel": "Afficher le panneau de positions", "Show temperatures panel": "Afficher le panneau des temp&eacute;ratures", "Show extruder panel": "Afficher le panneau d'extrusion", "Show files panel": "Afficher le panneau des fichiers", "Show GRBL panel": "Afficher le panneau GRBL", "Show commands panel": "Afficher le panneau des commandes", "Select files": "S&eacute;lect. fichiers", "Upload files": "T&eacute;l&eacute;charger. fichiers", "Select file": "S&eacute;lect. fichier", "$n files": "$n fichiers", "No file chosen": "Aucun fichier choisi", Length: "Longueur d'extrusion", "Output msg": "Messages vers", Enable: "Autoriser", Disable: "Bloquer", Serial: "Port s&eacute;rie", "Chip ID": "Identifiant processeur", "CPU Frequency": "Fr&eacute;quence processeur", "CPU Temperature": "Temp&eacute;rature processeur", "Free memory": "M&eacute;moire disponible", "Flash Size": "Taille m&eacute;moire flash", "Available Size for update": "Espace disponible pour M.A.J.", "Available Size for SPIFFS": "Espace disponible SPIFFS", "Baud rate": "Vitesse de communication", "Sleep mode": "Mode veille", Channel: "Canal", "Phy Mode": "Type r&eacute;seau", "Web port": "Port internet", "Data port": "Port de donn&eacute;es", "Active Mode": "Mode actif", "Connected to": "Connect&eacute; &agrave;", "IP Mode": "Mode IP", Gateway: "Gateway", Mask: "Masque", DNS: "DNS", "Disabled Mode": "Mode inactif", "Captive portal": "Portail de capture", Enabled: "Activ&eacute;", "Web Update": "M.A.J. Internet", "Pin Recovery": "Bouton de R.A.Z.", Disabled: "D&eacute;sactiv&eacute;", "Target Firmware": "Firmware cible", "SD Card Support": "Support Carte SD", "Time Support": "Serveur NTP", "M117 output": "Affichage vers imprimante", "Oled output": "Affichage vers oled", "Serial output": "Affichage vers port s&eacute;rie", "Web socket output": "Affichage vers websocket", "TCP output": "Affichage vers flux TCP", "FW version": "Version", "Show DHT output": "Afficher DHT", "DHT Type": "Type de DHT", "DHT check (seconds)": "Intervalle de contr&ocirc;le du DHT (secondes)", "SD speed divider": "Facteur diviseur carte SD", "Number of extruders": "Nombre d'extrudeurs", "Mixed extruders": "Extrudeurs mix&eacute;s", Extruder: "Extrudeur", "Enable lock interface": "Activer verrouillage interface", "Lock interface": "Verrouiller interface", "Unlock interface": "D&eacute;verrouiller interface", "You are disconnected": "Vous &ecirc;tes d&eacute;connect&eacute;", "Looks like you are connected from another place, so this page is now disconnected": "Apparement vous &ecirc;tes connect&eacute; sur une autre page, donc cette page est d&eacute;sormais d&eacute;connect&eacute;e.", "Please reconnect me": "SVP reconnectez-moi", Mist: "Brouillard", Flood: "Arrosage", Spindle: "Broche", "Connection monitoring": "Surveillance de la connexion", "XY Feedrate value must be at least 1 mm/min!": "La valeur de l'acc&eacute;l&eacute;ration XY doit &ecirc;tre sup&eacute;rieure &agrave; 1mm/min !", "Z Feedrate value must be at least 1 mm/min!": "La valeur de l'acc&eacute;l&eacute;ration Z doit &ecirc;tre sup&eacute;rieure &agrave; 1mm/min !", "Hold:0": "Suspension compl&egrave;te. Pr&ecirc;t &agrave; red&eacute;marrer.", "Hold:1": "Suspension en cours. Un Reset d&eacute;clenchera une alarme.", "Door:0": "Porte ferm&eacute;e. Pr&ecirc;t &agrave; red&eacute;marrer.", "Door:1": "Machine arr&ecirc;t&eacute;e. Porte toujours ouverte. Impossible de red&eacute;marrer tant qu'ouverte.", "Door:2": "Porte ouverte. Suspension (ou parking) en cours. Un Reset d&eacute;clenchera une alarme.", "Door:3": "Porte ferm&eacute;e et red&eacute;marrage en cours. Retour du parking si applicable. Un Reset d&eacute;clenchera une alarme.", "ALARM:1": "Limites mat&eacute;rielles atteintes. La position machine a &eacute;t&eacute; probablement perdue &agrave; cause de l'arr&ecirc;t rapide. La recherche d'origine est fortement recommand&eacute;e.", "ALARM:2": "Alarme limite logicielles. Un mouvement G-code a d&eacute;pass&eacute; les limites de la machine. La position de la machine a &eacute;t&eacute; conserv&eacute;e. L'alarme peut &egrave;tre acquitt&eacute;e sans probl&egrave;me.", "ALARM:3": "Reset lors d'un d&eacute;placemnet machine. La position machine est probablement perdue &agrave; cause de l'arr&ecirc;t rapide. La recherche d'origine est fortement recommand&eacute;e.", "ALARM:4": "Echec du sondage. La sonde n'est pas dans l'&eacute;tat inital attendu apr&egrave;s avoir d&eacute;marr&eacute; le cycle de sondage quand G38.2 et G38.3 ne sont pas d&eacute;clench&eacute;s et G38.4 and G38.5 sont d&eacute;clench&eacute;s.", "ALARM:5": "Echec du sondage. La sonde n'a pas touch&eacute; la pi&egrave;ce durant le mouvement programm&eacute; pour G38.2 et G38.4.", "ALARM:6": "Echec de la recherche d'origine. Le cycle a &eacute;t&eacute; interrompu par un reset", "ALARM:7": "Echec de la recherche d'origine. La porte a &eacute;t&eacute; ouverte durant la recherche d'origine.", "ALARM:8": "Echec de la recherche d'origine. Le trajet de r&eacute;tractation n'a pas d&eacute;sactiv&eacute; le capteur de la sonde. Essayez d'augmenter la valeur du retrait ou v&eacute;rifiez le c&acirc;blage.", "ALARM:9": "Echec de la recherche d'origine. La sonde n'a pas &eacute;t&eacute; activ&eacute;e durant le trajet de recherche. Essayez d'augmenter le d&eacute;placement max, de diminuer la distance de r&eacute;tractation ou v&eacute;rifiez le c&acirc;blage.", "error:1": "Une instruction G-code consiste en une lettre et une valeur num&eacute;rique. La lettre n'a pas &eacute;t&eacute; trouv&eacute;e.", "error:2": "Valeur de l'instruction G-code ou valeur num&eacute;rique invalide.", "error:3": "La commande syst&egrave;me '$' de GRBL n'a pas &eacute;t&eacute; reconnue ou est invalide.", "error:4": "Une valeur n&eacute;gative a &eacute;t&eacute; re&ccedil;ue à la place d'une valeur positive.", "error:5": "Echec de la recherche d'origine. Elle n'est pas activ&eacute;e dans les param&egrave;tres.", "error:6": "La largeur d'impulsion de pas doit &ecirc;tre sup&eacute;rieure &agrave; 3usec.", "error:7": "Echec de la lecture de l'EEPROM. Restauration automatique de son contenu avec les valeurs par d&eacute;faut.", "error:8": "La commande Grbl '$' ne peut &ecirc;tre utilis&eacute;e tant que grbl n'est pas en attente.", "error:9": "Les commandes G-code sont verrouill&eacute;es durant une alarme ou un d&eacute;placement rapide.", "error:10": "Les limites logicielles ne peuvent &ecirc;tre actuv&eacute;es sans que la recherche d'origine ne le soit aussi.", "error:11": "Le nombre max de caract&egrave;res par ligne a &eacute;t&eacute; atteint.La commande re&ccedil;ue n'a pas &eacute;t&eacute; ex&eacute;cut&eacute;e", "error:12": "La valeur de la commande Grbl '$' fait que la fr&eacute;quence de pas sera trop importante.", "error:13": "Porte d&eacute;tect&eacute;e comme ouverte.", "error:14": "Les informations de compilation ou la ligne de d&eacute;marrage d&eacute;passent les capacit&eacute;s de stockage de l'EEPROM. La ligne ne sera pas stock&eacute;e.", "error:15": "La cible du mouvement de d&eacute;placement rapide d&eacute;passe les dimensions de la machine. La commande a &eacute;t&eacute; ignor&eacute;e.", "error:16": "Le d&eacute;placement rapide n'a pas de '=' ou contient du g-code prohib&eacute;.", "error:17": "Le mode Laser n&eacute;cessite une sortie PWM.", "error:20": "G-code non support&eacute; ou invalide trouv&eacute; dans le bloc.", "error:21": "Plus d'une instruction Gcode du m&ecirc;me groupe modal trouv&eacute; dans le block.", "error:22": "La vitesse de d&eacute;placement n'a pas encore &eacute;t&eacute; d&eacute;finie ou est invalide.", "error:23": "La commande G-code dans le bloc requiert une valeur enti&egrave;re.", "error:24": "Plus d'une instruction Gcode requierrant un mot cl&eacute; d'axe trouv&eacute; dans le bloc.", "error:25": "Mot gcode r&eacute;p&eacute;t&eacute; trouv&eacute; dans le bloc.", "error:26": "Pas de mot cl&eacute; d'axe trouv&eacute; dans le blog de gcode, alors que le groupe modal courant en n&eacute;cessite.", "error:27": "Num&eacute;ro de ligne invalide.", "error:28": "La commande G-code n&eacute;cessite une valeur", "error:29": "Le jeu de coordonn&eacute;es de travail G59.x n'est pas support&eacute;.", "error:30": "G53 n'est autoris&eacute; qu'avec les d&eacute;placements G0 et G1.", "error:31": "Mots cl&eacute;s de d&eacute;placement d'axe trouv&eacute; dans le bloc alors que la commande ou l'&eacute;tat modal courant n'en n&eacute;cessite pas.", "error:32": "Les arcs G2 and G3 n&eacute;cessitent au moins un mot cl&eacute; d'axe de plan.", "error:33": "Cible de la commande de d&eacute;placement invalide.", "error:34": "La valeur du rayon de l'arc est invalide.", "error:35": "Les arcs G2 et G3 au moins un mot cl&eacute; d&eacute;calage de plan.", "error:36": "Valeurs inutiles trouv&eacute;es dans le bloc.", "error:37": "Le d&eacute;calage dynamique d'outil G43.1 n'est pas assign&eacute; à un axe configur&eacute; pour la longeur d'outil.", "error:38": "Num&eacute;ro d'outil sup&eacute;rieur à la valeur max support&eacute;e.", "error:60": "Impossible de monter la carte SD", "error:61": "Impossible d'ouvrir un fichier en lecture sur la carte SD", "error:62": "Impossible d'ouvrir un r&eacute;pertoire sur la carte SD", "error:63": "R&eacute;pertoire non trouv&eacute; sur la carte SD", "error:64": "Fichier vide sur la carte SD", "error:70": "Echec de d&eacute;marrage du Bluetooth" },
        japanesetrans = { ja: "&#26085;&#26412;&#35486;", "ESP3D for": "ESP3D for", "Value of auto-check must be between 0s and 99s !!": "&#12458;&#12540;&#12488;&#12481;&#12455;&#12483;&#12463;&#12398;&#20516;&#12399;0&#65374;99&#31186;&#12398;&#38291;&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "Value of extruder velocity must be between 1 mm/min and 9999 mm/min !": "&#12456;&#12463;&#12473;&#12488;&#12523;&#12540;&#12480;&#12540;&#12398;&#36895;&#24230;&#12399;1&#65374;9999mm/min&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "Value of filament length must be between 0.001 mm and 9999 mm !": "&#12501;&#12451;&#12521;&#12513;&#12531;&#12488;&#12398;&#38263;&#12373;&#12399;0.001&#65374;9999mm&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "cannot have '-', '#' char or be empty": "'-', '#'&#12398;&#25991;&#23383;&#12418;&#12375;&#12367;&#12399;&#31354;&#30333;&#12399;&#20837;&#12428;&#12427;&#12371;&#12392;&#12364;&#12391;&#12365;&#12414;&#12379;&#12435;", "cannot have '-', 'e' char or be empty": "'-', 'e'&#12398;&#25991;&#23383;&#12418;&#12375;&#12367;&#12399;&#31354;&#30333;&#12399;&#20837;&#12428;&#12427;&#12371;&#12392;&#12364;&#12391;&#12365;&#12414;&#12379;&#12435;", "Failed:": "&#22833;&#25943;:", "File config / config.txt not found!": "File config / config.txt&#12364;&#35211;&#12388;&#12363;&#12426;&#12414;&#12379;&#12435;&#65281;", "File name cannot be empty!": "&#12501;&#12449;&#12452;&#12523;&#21517;&#12399;&#31354;&#30333;&#12395;&#12391;&#12365;&#12414;&#12379;&#12435;&#65281;", "Value must be ": "&#20516;&#12399;&#20197;&#19979;&#12398;&#36890;&#12426;&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;", "Value must be between 0 degres and 999 degres !": "&#20516;&#12399; 0&#176;&#65374;999&#176;&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "Value must be between 0% and 100% !": "&#20516;&#12399;0&#65374;100%&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "Value must be between 25% and 150% !": "&#20516;&#12399;25&#65374;150%&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "Value must be between 50% and 300% !": "&#20516;&#12399;50&#65374;300%&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "XY feedrate value must be between 1 mm/min and 9999 mm/min !": "XY&#12398;&#36865;&#12426;&#36895;&#24230;&#12399;1&#65374;9999mm/min&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "Z feedrate value must be between 1 mm/min and 999 mm/min !": "Z&#12398;&#36865;&#12426;&#36895;&#24230;&#12399;1&#65374;999mm/min&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", " seconds": " &#31186;", Abort: "&#20013;&#27490;", "auto-check every:": "&#12458;&#12540;&#12488;&#12481;&#12455;&#12483;&#12463;&#38291;&#38548;:", "auto-check position every:": "&#20301;&#32622;&#12458;&#12540;&#12488;&#12481;&#12455;&#12483;&#12463;&#38291;&#38548;:", Autoscroll: "&#12458;&#12540;&#12488;&#12473;&#12463;&#12525;&#12540;&#12523;", "Max travel": "&#26368;&#22823;&#31227;&#21205;&#37327;", "Feed rate": "&#36865;&#12426;&#36895;&#24230;", "Touch plate thickness": "&#12479;&#12483;&#12481;&#12503;&#12524;&#12540;&#12488;&#21402;&#12373;", Redundant: "Redundant", Probe: "&#12503;&#12525;&#12540;&#12502;", Bed: "&#12505;&#12483;&#12489;", Chamber: "&#12481;&#12515;&#12531;&#12496;&#12540;", Board: "&#12508;&#12540;&#12489;", "Busy...": "&#12499;&#12472;&#12540;...", Camera: "&#12459;&#12513;&#12521;", Cancel: "&#12461;&#12515;&#12531;&#12475;&#12523;", "Cannot get EEPROM content!": "EEPROM&#12398;&#20869;&#23481;&#12434;&#21462;&#24471;&#12391;&#12365;&#12414;&#12379;&#12435;&#65281;", Clear: "Clear", Close: "&#38281;&#12376;&#12427;", Color: "&#12459;&#12521;&#12540;", Commands: "&#12467;&#12510;&#12531;&#12489;", "Communication locked by another process, retry later.": "&#36890;&#20449;&#12364;&#20182;&#12398;&#12503;&#12525;&#12475;&#12473;&#12395;&#12424;&#12387;&#12390;&#12525;&#12483;&#12463;&#12373;&#12428;&#12390;&#12356;&#12414;&#12377;&#12290;&#24460;&#12363;&#12425;&#12522;&#12488;&#12521;&#12452;&#12375;&#12390;&#12367;&#12384;&#12373;&#12356;&#12290;", "Communication locked!": "&#36890;&#20449;&#12364;&#12525;&#12483;&#12463;&#12373;&#12428;&#12390;&#12356;&#12414;&#12377;&#65281;", "Communications are currently locked, please wait and retry.": "&#36890;&#20449;&#12364;&#29694;&#22312;&#12525;&#12483;&#12463;&#12373;&#12428;&#12390;&#12356;&#12414;&#12377;&#12290;&#12375;&#12400;&#12425;&#12367;&#24453;&#12388;&#12363;&#12522;&#12488;&#12521;&#12452;&#12375;&#12390;&#12367;&#12384;&#12373;&#12356;&#12290;", "Confirm deletion of directory: ": "&#12487;&#12451;&#12524;&#12463;&#12488;&#12522;&#21066;&#38500;&#12398;&#30906;&#35469;: ", "Confirm deletion of file: ": "&#12501;&#12449;&#12452;&#12523;&#21066;&#38500;&#12398;&#30906;&#35469;: ", "Connecting ESP3D...": "ESP3D&#12395;&#25509;&#32154;&#20013;...", "Connection failed! is your FW correct?": "&#25509;&#32154;&#22833;&#25943;&#12290;&#27491;&#12375;&#12356;&#12501;&#12449;&#12540;&#12512;&#12454;&#12455;&#12450;&#12391;&#12377;&#12363;&#65311;", Controls: "&#12467;&#12531;&#12488;&#12525;&#12540;&#12523;", Credits: "&#12463;&#12524;&#12472;&#12483;&#12488;", Dashboard: "&#12480;&#12483;&#12471;&#12517;&#12508;&#12540;&#12489;", "Data mofified": "&#12487;&#12540;&#12479;&#22793;&#26356;", "Do you want to save?": "&#20445;&#23384;&#12375;&#12414;&#12377;&#12363;&#65311;", "Enable second extruder controls": "&#12475;&#12459;&#12531;&#12489;&#12456;&#12463;&#12473;&#12488;&#12523;&#12540;&#12480;&#12540;&#12398;&#12467;&#12531;&#12488;&#12525;&#12540;&#12523;&#12434;&#26377;&#21177;&#21270;", Error: "Error", "ESP3D Filesystem": "ESP3D &#12501;&#12449;&#12452;&#12523;&#12471;&#12473;&#12486;&#12512;", "ESP3D Settings": "ESP3D &#35373;&#23450;", "ESP3D Status": "ESP3D &#12473;&#12486;&#12540;&#12479;&#12473;", "ESP3D Update": "ESP3D &#12450;&#12483;&#12503;&#12487;&#12540;&#12488;", Extrude: "&#25276;&#20986;&#12375;", "Extruder T0": "&#12456;&#12463;&#12473;&#12488;&#12523;&#12540;&#12480;&#12540; T0", "Extruder T1": "&#12456;&#12463;&#12473;&#12488;&#12523;&#12540;&#12480;&#12540;  T1", Extruders: "&#12456;&#12463;&#12473;&#12488;&#12523;&#12540;&#12480;&#12540;", "Fan (0-100%)": "&#12501;&#12449;&#12531; (0-100%)", "Feed (25-150%)": "&#36865;&#12426; (25-150%)", "Feedrate :": "&#36865;&#12426;&#36895;&#24230; :", Filename: "&#12501;&#12449;&#12452;&#12523;&#21517;", "Filename/URI": "&#12501;&#12449;&#12452;&#12523;&#21517;/URI", "Verbose mode": "&#35443;&#32048;&#12514;&#12540;&#12489;", Firmware: "&#12501;&#12449;&#12540;&#12512;&#12454;&#12455;&#12450;", "Flow (50-300%)": "Flow (50-300%)", "Heater T0": "&#12498;&#12540;&#12479;&#12540; T0", "Heater T1": "&#12498;&#12540;&#12479;&#12540; T1", Help: "&#12504;&#12523;&#12503;", Icon: "&#12450;&#12452;&#12467;&#12531;", Interface: "&#12452;&#12531;&#12479;&#12540;&#12501;&#12455;&#12540;&#12473;", Join: "&#36861;&#21152;", Label: "&#12521;&#12505;&#12523;", "List of available Access Points": "&#26377;&#21177;&#12394;&#12450;&#12463;&#12475;&#12473;&#12509;&#12452;&#12531;&#12488;&#12398;&#19968;&#35239;", "Macro Editor": "&#12510;&#12463;&#12525;&#12456;&#12487;&#12451;&#12479;&#12540;", mm: "mm", "mm/min": "mm/min", "Motors off": "&#12514;&#12540;&#12479;&#12540;off", Name: "&#21517;&#21069;", "Name:": "&#21517;&#21069;:", Network: "&#12493;&#12483;&#12488;&#12527;&#12540;&#12463;", "No SD card detected": "SD&#12459;&#12540;&#12489;&#12364;&#26908;&#20986;&#12373;&#12428;&#12414;&#12379;&#12435;", No: "No", "Occupation:": "Occupation:", Ok: "Ok", Options: "&#12458;&#12503;&#12471;&#12519;&#12531;", "Out of range": "&#31684;&#22258;&#22806;", "Please Confirm": "&#30906;&#35469;&#12375;&#12390;&#12367;&#12384;&#12373;&#12356;", "Please enter directory name": "&#12487;&#12451;&#12524;&#12463;&#12488;&#12522;&#21517;&#12434;&#20837;&#21147;&#12375;&#12390;&#12367;&#12384;&#12373;&#12356;", "Please wait...": "&#12362;&#24453;&#12385;&#12367;&#12384;&#12373;&#12356;...", "Printer configuration": "&#12503;&#12522;&#12531;&#12479;&#12540;&#35373;&#23450;", "GRBL configuration": "GRBL&#35373;&#23450;", Printer: "&#12503;&#12522;&#12531;&#12479;&#12540;", Progress: "&#36914;&#25431;", Protected: "Protected", Refresh: "&#26356;&#26032;", "Restart ESP3D": "ESP3D&#12434;&#20877;&#36215;&#21205;", "Restarting ESP3D": "ESP3D&#12434;&#20877;&#36215;&#21205;&#20013;", Restarting: "&#20877;&#36215;&#21205;&#20013;", "Restarting, please wait....": "&#20877;&#36215;&#21205;&#20013;&#12391;&#12377;&#12290;&#12362;&#24453;&#12385;&#12367;&#12384;&#12373;&#12356;....", Retry: "&#12522;&#12488;&#12521;&#12452;", Reverse: "Reverse", "Save macro list failed!": "&#12510;&#12463;&#12525;&#12522;&#12473;&#12488;&#12398;&#20445;&#23384;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#65281;", Save: "&#20445;&#23384;", Saving: "&#20445;&#23384;&#20013;", Scanning: "&#12473;&#12461;&#12515;&#12531;&#20013;", "SD Files": "SD&#12501;&#12449;&#12452;&#12523;", sec: "sec", "Send Command...": "&#12467;&#12510;&#12531;&#12489;&#36865;&#20449;...", Send: "&#36865;&#20449;", "Set failed": "Set failed", Set: "&#12475;&#12483;&#12488;", Signal: "&#20449;&#21495;", Size: "&#12469;&#12452;&#12474;", SSID: "SSID", Target: "Target", Temperatures: "&#28201;&#24230;", "Total:": "Total:", Type: "Type", "Update Firmware ?": "&#12501;&#12449;&#12540;&#12512;&#12454;&#12455;&#12450;&#12434;&#12450;&#12483;&#12503;&#12487;&#12540;&#12488;&#12375;&#12414;&#12377;&#12363;&#65311;", "Update is ongoing, please wait and retry.": "&#12450;&#12483;&#12503;&#12487;&#12540;&#12488;&#12399;&#36914;&#34892;&#20013;&#12391;&#12377;&#12290;&#24453;&#12388;&#12363;&#12522;&#12488;&#12521;&#12452;&#12375;&#12390;&#12367;&#12384;&#12373;&#12356;&#12290;", Update: "&#12450;&#12483;&#12503;&#12487;&#12540;&#12488;", "Upload failed : ": "&#12450;&#12483;&#12503;&#12525;&#12540;&#12489;&#22833;&#25943; : ", "Upload failed": "&#12450;&#12483;&#12503;&#12525;&#12540;&#12489;&#12375;&#12390;", Upload: "&#12450;&#12483;&#12503;&#12525;&#12540;&#12489;", "Uploading ": "&#12450;&#12483;&#12503;&#12525;&#12540;&#12489;&#20013; ", "Upload done": "&#12450;&#12483;&#12503;&#12525;&#12540;&#12489;&#23436;&#20102;", "Used:": "Used:", "Value | Target": "&#20516; | Target", Value: "&#20516;", "Wrong data": "&#38291;&#36949;&#12387;&#12383;&#12487;&#12540;&#12479;", Yes: "Yes", Light: "Light", None: "None", Modem: "Modem", STA: "STA", AP: "AP", BT: "Bluetooth", "Baud Rate": "&#12508;&#12540;&#12524;&#12540;&#12488;", "Sleep Mode": "&#12473;&#12522;&#12540;&#12503;&#12514;&#12540;&#12489;", "Web Port": "Web&#12509;&#12540;&#12488;", "Data Port": "Data&#12509;&#12540;&#12488;", Hostname: "&#12507;&#12473;&#12488;&#21517;", "Wifi mode": "Wifi&#12514;&#12540;&#12489;", "Station SSID": "Station SSID", "Station Password": "Station &#12497;&#12473;&#12527;&#12540;&#12489;", "Station Network Mode": "Station &#12493;&#12483;&#12488;&#12527;&#12540;&#12463;&#12514;&#12540;&#12489;", "Station IP Mode": "Station IP &#12514;&#12540;&#12489;", DHCP: "DHCP", Static: "&#38745;&#30340;", "Station Static IP": "Station &#38745;&#30340; IP", "Station Static Mask": "Station &#12493;&#12483;&#12488;&#12510;&#12473;&#12463;", "Station Static Gateway": "Station &#12466;&#12540;&#12488;&#12454;&#12455;&#12452;", "AP SSID": "AP SSID", "AP Password": "AP &#12497;&#12473;&#12527;&#12540;&#12489;", "AP Network Mode": "AP Network &#12514;&#12540;&#12489;", "SSID Visible": "SSID Visible", "AP Channel": "AP &#12481;&#12515;&#12531;&#12493;&#12523;", Open: "Open", Authentication: "&#35469;&#35388;&#26041;&#24335;", "AP IP Mode": "AP IP &#12514;&#12540;&#12489;", "AP Static IP": "AP &#38745;&#30340;IP", "AP Static Mask": "AP &#12493;&#12483;&#12488;&#12510;&#12473;&#12463;", "AP Static Gateway": "AP &#12466;&#12540;&#12488;&#12454;&#12455;&#12452;", "Time Zone": "&#12479;&#12452;&#12512;&#12478;&#12540;&#12531;", "Day Saving Time": "&#12469;&#12510;&#12540;&#12479;&#12452;&#12512;", "Time Server 1": "Time Server 1", "Time Server 2": "Time Server 2", "Time Server 3": "Time Server 3", "Target FW": "Target FW", "Direct SD access": "Direct SD access", "Direct SD Boot Check": "Direct SD Boot Check", "Primary SD": "&#12503;&#12521;&#12452;&#12510;&#12522; SD", "Secondary SD": "&#12475;&#12459;&#12531;&#12480;&#12522; SD", "Temperature Refresh Time": "&#28201;&#24230;&#26356;&#26032;&#26178;&#38291;", "Position Refresh Time": "&#20301;&#32622;&#26356;&#26032;&#26178;&#38291;", "Status Refresh Time": "&#12473;&#12486;&#12540;&#12479;&#12473;&#26356;&#26032;&#26178;&#38291;", "XY feedrate": "XY &#36865;&#12426;&#36895;&#24230;", "Z feedrate": "Z &#36865;&#12426;&#36895;&#24230;", "E feedrate": "E &#36865;&#12426;&#36895;&#24230;", "Camera address": "&#12459;&#12513;&#12521;&#12398;&#12450;&#12489;&#12524;&#12473;", Setup: "&#12475;&#12483;&#12488;&#12450;&#12483;&#12503;", "Start setup": "&#12475;&#12483;&#12488;&#12450;&#12483;&#12503;&#12434;&#38283;&#22987;", "This wizard will help you to configure the basic settings.": "&#12371;&#12398;&#12454;&#12451;&#12470;&#12540;&#12489;&#12391;&#22522;&#26412;&#30340;&#12394;&#35373;&#23450;&#12434;&#34892;&#12356;&#12414;&#12377;&#12290;", "Press start to proceed.": "&#38283;&#22987;&#12434;&#25276;&#12375;&#12390;&#32154;&#34892;&#12375;&#12414;&#12377;&#12290;", "Save your printer's firmware base:": "&#12503;&#12522;&#12531;&#12479;&#12398;&#12501;&#12449;&#12540;&#12512;&#12454;&#12455;&#12450;&#12434;&#20445;&#23384;:", "This is mandatory to get ESP working properly.": "ESP&#12434;&#27491;&#24120;&#12395;&#21205;&#20316;&#12373;&#12379;&#12427;&#12383;&#12417;&#12395;&#12399;&#24517;&#38920;&#12391;&#12377;&#12290;", "Save your printer's board current baud rate:": "&#12503;&#12522;&#12531;&#12479;&#22522;&#26495;&#12398;&#29694;&#22312;&#12398;&#12508;&#12540;&#12524;&#12540;&#12488;&#12434;&#20445;&#23384;:", "Printer and ESP board must use same baud rate to communicate properly.": "&#12503;&#12522;&#12531;&#12479;&#12392;ESP&#12508;&#12540;&#12489;&#12399;&#36969;&#20999;&#12395;&#36890;&#20449;&#12377;&#12427;&#12383;&#12417;&#12395;&#21516;&#12376;&#12508;&#12540;&#12524;&#12540;&#12488;&#12434;&#20351;&#29992;&#12377;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#12290;", Continue: "&#32154;&#34892;", "WiFi Configuration": "WiFi &#35373;&#23450;", "Define ESP role:": "ESP&#12398;&#24441;&#21106;&#12434;&#23450;&#32681;:", "AP define access point / STA allows to join existing network": "AP&#12399;&#12450;&#12463;&#12475;&#12473;&#12509;&#12452;&#12531;&#12488;&#12392;&#12375;&#12390;&#21205;&#12365;&#12414;&#12377;/ STA&#12399;&#26082;&#23384;&#12398;&#12493;&#12483;&#12488;&#12527;&#12540;&#12463;&#12395;&#21152;&#12431;&#12426;&#12414;&#12377;", "What access point ESP need to be connected to:": "&#12393;&#12398;&#12450;&#12463;&#12475;&#12473;&#12509;&#12452;&#12531;&#12488;&#12395;&#25509;&#32154;&#12375;&#12414;&#12377;&#12363;&#65311;:", "You can use scan button, to list available access points.": "&#21033;&#29992;&#21487;&#33021;&#12394;&#12450;&#12463;&#12475;&#12473;&#12509;&#12452;&#12531;&#12488;&#12434;&#12522;&#12473;&#12488;&#12450;&#12483;&#12503;&#12377;&#12427;&#12383;&#12417;&#12395;&#12473;&#12461;&#12515;&#12531;&#12508;&#12479;&#12531;&#12434;&#20351;&#29992;&#12377;&#12427;&#12371;&#12392;&#12364;&#12391;&#12365;&#12414;&#12377;&#12290;", "Password to join access point:": "&#12450;&#12463;&#12475;&#12473;&#12509;&#12452;&#12531;&#12488;&#12398;&#12497;&#12473;&#12527;&#12540;&#12489;:", "Define ESP name:": "ESP&#12398;&#21517;&#21069;&#12434;&#23450;&#32681;:", "What is ESP access point SSID:": "&#12450;&#12463;&#12475;&#12473;&#12509;&#12452;&#12531;&#12488;&#12398;SSID:", "Password for access point:": "&#12450;&#12463;&#12475;&#12473;&#12509;&#12452;&#12531;&#12488;&#12398;&#12497;&#12473;&#12527;&#12540;&#12489;:", "Define security:": "&#12475;&#12461;&#12517;&#12522;&#12486;&#12451;&#12434;&#23450;&#32681;:", "SD Card Configuration": "SD&#12459;&#12540;&#12489; &#35373;&#23450;", "Is ESP connected to SD card:": "ESP&#12395;SD&#12459;&#12540;&#12489;&#12434;&#25509;&#32154;&#12375;&#12390;&#12356;&#12414;&#12377;&#12363;:", "Check update using direct SD access:": "&#30452;&#25509;SD&#12395;&#12450;&#12463;&#12475;&#12473;&#12375;&#12450;&#12483;&#12503;&#12487;&#12540;&#12488;&#12434;&#30906;&#35469;:", "SD card connected to ESP": "ESP&#12395;SD&#12459;&#12540;&#12489;&#12364;&#25509;&#32154;&#12373;&#12428;&#12390;&#12356;&#12414;&#12377;", "SD card connected to printer": "&#12503;&#12522;&#12531;&#12479;&#12540;&#12395;SD&#12459;&#12540;&#12489;&#12364;&#25509;&#32154;&#12373;&#12428;&#12390;&#12356;&#12414;&#12377;", "Setup is finished.": "&#12475;&#12483;&#12488;&#12450;&#12483;&#12503;&#23436;&#20102;", "After closing, you will still be able to change or to fine tune your settings in main interface anytime.": "&#32066;&#20102;&#24460;&#12418;&#12289;&#12513;&#12452;&#12531;&#12452;&#12531;&#12479;&#12540;&#12501;&#12455;&#12452;&#12473;&#12395;&#12390;&#35373;&#23450;&#12434;&#22793;&#26356;&#12375;&#12383;&#12426;&#12289;&#35519;&#25972;&#12375;&#12383;&#12426;&#12377;&#12427;&#12371;&#12392;&#12399;&#12356;&#12388;&#12391;&#12418;&#21487;&#33021;&#12391;&#12377;&#12290;", "You may need to restart the board to apply the new settings and connect again.": "&#26032;&#12375;&#12356;&#35373;&#23450;&#12434;&#36969;&#29992;&#12377;&#12427;&#12395;&#12399;&#12289;&#12508;&#12540;&#12489;&#12434;&#20877;&#36215;&#21205;&#12375;&#12390;&#20877;&#24230;&#25509;&#32154;&#12377;&#12427;&#24517;&#35201;&#12364;&#12354;&#12427;&#12363;&#12418;&#12375;&#12428;&#12414;&#12379;&#12435;&#12290;", "Identification requested": "Identification requested", admin: "&#31649;&#29702;&#32773;", user: "&#12518;&#12540;&#12470;&#12540;", guest: "&#12466;&#12473;&#12488;", "Identification invalid!": "Identification invalid!", "Passwords do not matches!": "&#12497;&#12473;&#12527;&#12540;&#12489;&#12364;&#19981;&#19968;&#33268;&#12391;&#12377;&#65281;", "Password must be >1 and <16 without space!": "&#12497;&#12473;&#12527;&#12540;&#12489;&#12399;&#31354;&#30333;&#12394;&#12375;&#12391;1&#65374;16&#12398;&#38263;&#12373;&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "User:": "&#12518;&#12540;&#12470;&#12540;:", "Password:": "&#12497;&#12473;&#12527;&#12540;&#12489;:", Submit: "&#36865;&#20449;", "Change Password": "&#12497;&#12473;&#12527;&#12540;&#12489;&#22793;&#26356;", "Current Password:": "&#29694;&#22312;&#12398;&#12497;&#12473;&#12527;&#12540;&#12489;:", "New Password:": "&#26032;&#12375;&#12356;&#12497;&#12473;&#12527;&#12540;&#12489;:", "Confirm New Password:": "&#26032;&#12375;&#12356;&#12497;&#12473;&#12527;&#12540;&#12489;&#12398;&#30906;&#35469;:", "Error : Incorrect User": "Error : &#12518;&#12540;&#12470;&#12540;&#12364;&#36949;&#12356;&#12414;&#12377;", "Error: Incorrect password": "Error: &#12497;&#12473;&#12527;&#12540;&#12489;&#12364;&#36949;&#12356;&#12414;&#12377;", "Error: Missing data": "Error: &#12487;&#12540;&#12479;&#12364;&#35211;&#12388;&#12363;&#12426;&#12414;&#12379;&#12435;", "Error: Cannot apply changes": "Error: &#22793;&#26356;&#12434;&#36969;&#29992;&#12391;&#12365;&#12414;&#12379;&#12435;", "Error: Too many connections": "Error: &#25509;&#32154;&#12364;&#22810;&#12377;&#12366;&#12414;&#12377;", "Authentication failed!": "&#35469;&#35388;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#65281;", "Serial is busy, retry later!": "&#12471;&#12522;&#12450;&#12523;&#12399;&#12499;&#12472;&#12540;&#29366;&#24907;&#12391;&#12377;&#12290;&#24460;&#12363;&#12425;&#12522;&#12488;&#12521;&#12452;&#12375;&#12390;&#12367;&#12384;&#12373;&#12356;&#65281;", Login: "&#12525;&#12464;&#12452;&#12531;", "Log out": "&#12525;&#12464;&#12450;&#12454;&#12488;", Password: "&#12497;&#12473;&#12527;&#12540;&#12489;", "No SD Card": "SD&#12459;&#12540;&#12489;&#12364;&#12354;&#12426;&#12414;&#12379;&#12435;", "Check for Update": "&#12450;&#12483;&#12503;&#12487;&#12540;&#12488;&#12434;&#30906;&#35469;", "Please use 8.3 filename only.": "&#12501;&#12449;&#12452;&#12523;&#12493;&#12540;&#12512;&#12399;8.3&#12398;&#12415;&#20351;&#12387;&#12390;&#12367;&#12384;&#12373;&#12356;&#12290;", Preferences: "&#29872;&#22659;&#35373;&#23450;", Feature: "Feature", "Show camera panel": "&#12459;&#12513;&#12521;&#12497;&#12493;&#12523;&#12434;&#34920;&#31034;", "Auto load camera": "&#12459;&#12513;&#12521;&#12434;&#33258;&#21205;&#12525;&#12540;&#12489;", "Enable heater T0 redundant temperatures": "&#12498;&#12540;&#12479;&#12540;T0&#12398;redundant temperature&#12434;&#26377;&#21177;&#12395;&#12377;&#12427;", "Enable probe temperatures": "&#12503;&#12525;&#12540;&#12502;&#28201;&#24230;&#26377;&#21177;&#21270;", "Enable bed controls": "&#12505;&#12483;&#12489;&#12467;&#12531;&#12488;&#12525;&#12540;&#12523;&#26377;&#21177;&#21270;", "Enable chamber controls": "&#12481;&#12515;&#12531;&#12496;&#12540;&#12467;&#12531;&#12488;&#12525;&#12540;&#12523;&#26377;&#21177;&#21270;", "Enable fan controls": "&#12501;&#12449;&#12531;&#12467;&#12531;&#12488;&#12525;&#12540;&#12523;&#26377;&#21177;&#21270;", "Enable Z controls": "Z&#12467;&#12531;&#12488;&#12525;&#12540;&#12523;&#26377;&#21177;&#21270;", Panels: "&#12497;&#12493;&#12523;", "Show control panel": "&#12467;&#12531;&#12488;&#12525;&#12540;&#12523;&#12497;&#12493;&#12523;&#12434;&#34920;&#31034;", "Show temperatures panel": "&#28201;&#24230;&#12497;&#12493;&#12523;&#12434;&#34920;&#31034;", "Show extruder panel": "&#12456;&#12463;&#12473;&#12488;&#12523;&#12540;&#12480;&#12540;&#12497;&#12493;&#12523;&#12434;&#34920;&#31034;", "Show files panel": "&#12501;&#12449;&#12452;&#12523;&#12497;&#12493;&#12523;&#12434;&#34920;&#31034;", "Show GRBL panel": "GRBL&#12497;&#12493;&#12523;&#12434;&#34920;&#31034;", "Show commands panel": "&#12467;&#12510;&#12531;&#12489;&#12497;&#12493;&#12523;&#12434;&#34920;&#31034;", "Select files": "&#35079;&#25968;&#12501;&#12449;&#12452;&#12523;&#12434;&#36984;&#25246;", "Upload files": "ファイルをアップロードする", "Select file": "&#12501;&#12449;&#12452;&#12523;&#12434;&#36984;&#25246;", "$n files": "$n &#12501;&#12449;&#12452;&#12523;", "No file chosen": "&#36984;&#25246;&#12373;&#12428;&#12383;&#12501;&#12449;&#12452;&#12523;&#12399;&#12354;&#12426;&#12414;&#12379;&#12435;", Length: "&#38263;&#12373;", "Output msg": "&#20986;&#21147;&#12513;&#12483;&#12475;&#12540;&#12472;", Enable: "&#26377;&#21177;&#21270;", Disable: "&#28961;&#21177;&#21270;", Serial: "&#12471;&#12522;&#12450;&#12523;", "Chip ID": "&#12481;&#12483;&#12503; ID", "CPU Frequency": "CPU &#21608;&#27874;&#25968;", "CPU Temperature": "CPU &#28201;&#24230;", "Free memory": "&#31354;&#12365;&#12513;&#12514;&#12522;", "Flash Size": "Flash &#12469;&#12452;&#12474;", "Available Size for update": "&#26356;&#26032;&#26178;&#12395;&#21033;&#29992;&#21487;&#33021;&#12394;&#12469;&#12452;&#12474;", "Available Size for SPIFFS": "SPIFFS&#12395;&#21033;&#29992;&#21487;&#33021;&#12394;&#12469;&#12452;&#12474;", "Baud rate": "&#12508;&#12540;&#12524;&#12540;&#12488;", "Sleep mode": "&#12473;&#12522;&#12540;&#12503;&#12514;&#12540;&#12489;", Channel: "&#12481;&#12515;&#12531;&#12493;&#12523;", "Phy Mode": "Phy &#12514;&#12540;&#12489;", "Web port": "Web &#12509;&#12540;&#12488;", "Data port": "Data port", "Active Mode": "Active Mode", "Connected to": "&#25509;&#32154;&#20808;", "IP Mode": "IP &#12514;&#12540;&#12489;", Gateway: "&#12466;&#12540;&#12488;&#12454;&#12455;&#12452;", Mask: "&#12493;&#12483;&#12488;&#12510;&#12473;&#12463;", DNS: "DNS", "Disabled Mode": "&#28961;&#21177;&#21270;&#12373;&#12428;&#12383;&#12514;&#12540;&#12489;", "Captive portal": "&#12461;&#12515;&#12503;&#12486;&#12451;&#12502; &#12509;&#12540;&#12479;&#12523;", Enabled: "&#26377;&#21177;", "Web Update": "Web &#12450;&#12483;&#12503;&#12487;&#12540;&#12488;", "Pin Recovery": "Pin Recovery", Disabled: "&#28961;&#21177;", "Target Firmware": "Target Firmware", "SD Card Support": "SD Card Support", "Time Support": "Time Support", "M117 output": "M117 &#20986;&#21147;", "Oled output": "Oled &#20986;&#21147;", "Serial output": "&#12471;&#12522;&#12450;&#12523; &#20986;&#21147;", "Web socket output": "Web socket &#20986;&#21147;", "TCP output": "TCP &#20986;&#21147;", "FW version": "FW &#12496;&#12540;&#12472;&#12519;&#12531;", "Show DHT output": "Show DHT &#20986;&#21147;", "DHT Type": "DHT Type", "DHT check (seconds)": "DHT &#30906;&#35469; (&#31186;)", "SD speed divider": "SD speed divider", "Number of extruders": "&#12456;&#12463;&#12473;&#12488;&#12523;&#12540;&#12480;&#12540;&#12398;&#25968;", "Mixed extruders": "Mixed &#12456;&#12463;&#12473;&#12488;&#12523;&#12540;&#12480;&#12540;", Extruder: "&#12456;&#12463;&#12473;&#12488;&#12523;&#12540;&#12480;&#12540;", "Enable lock interface": "&#12452;&#12531;&#12479;&#12540;&#12501;&#12455;&#12540;&#12473;&#12525;&#12483;&#12463;&#12434;&#26377;&#21177;&#21270;", "Lock interface": "&#12452;&#12531;&#12479;&#12540;&#12501;&#12455;&#12540;&#12473;&#12525;&#12483;&#12463;", "Unlock interface": "&#12452;&#12531;&#12479;&#12540;&#12501;&#12455;&#12540;&#12473;&#12525;&#12483;&#12463;&#35299;&#38500;", "You are disconnected": "&#20999;&#26029;&#12375;&#12414;&#12375;&#12383;&#12290;", "Looks like you are connected from another place, so this page is now disconnected": "&#21029;&#12398;&#22580;&#25152;&#12363;&#12425;&#25509;&#32154;&#12375;&#12390;&#12356;&#12427;&#12424;&#12394;&#12398;&#12391;&#12289;&#12371;&#12398;&#12506;&#12540;&#12472;&#12399;&#29694;&#22312;&#20999;&#26029;&#12373;&#12428;&#12390;&#12356;&#12414;&#12377;&#12290;", "Please reconnect me": "&#20877;&#25509;&#32154;&#12375;&#12390;&#12367;&#12384;&#12373;&#12356;", Mist: "&#12511;&#12473;&#12488;", Flood: "&#12501;&#12523;&#12540;&#12489;", Spindle: "&#12473;&#12500;&#12531;&#12489;&#12523;", "Connection monitoring": "&#25509;&#32154;&#30435;&#35222;", "XY Feedrate value must be at least 1 mm/min!": "XY &#36865;&#12426;&#36895;&#24230;&#12399;&#26368;&#20302;1 mm/min&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;!", "Z Feedrate value must be at least 1 mm/min!": "Z &#36865;&#12426;&#36895;&#24230;&#12399;&#26368;&#20302;1 mm/min&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "Hold:0": "&#19968;&#26178;&#20572;&#27490;&#23436;&#20102;&#12375;&#12414;&#12375;&#12383;&#12290;&#20877;&#38283;&#12391;&#12365;&#12414;&#12377;&#12290;", "Hold:1": "&#19968;&#26178;&#20572;&#27490;&#12399;&#36914;&#34892;&#20013;&#12391;&#12377;. &#12522;&#12475;&#12483;&#12488;&#12377;&#12427;&#12392;&#12450;&#12521;&#12540;&#12512;&#12364;&#30330;&#29983;&#12375;&#12414;&#12377;.", "Door:0": "&#12489;&#12450;&#12364;&#38281;&#12414;&#12426;&#12414;&#12375;&#12383;&#12290;&#20877;&#38283;&#12391;&#12365;&#12414;&#12377;&#12290;", "Door:1": "&#27231;&#26800;&#12364;&#20572;&#27490;&#12375;&#12414;&#12375;&#12383;&#12290;&#12489;&#12450;&#12364;&#38283;&#12356;&#12383;&#12414;&#12414;&#12391;&#12377;&#12290;&#38281;&#12376;&#12427;&#12414;&#12391;&#20877;&#38283;&#12391;&#12365;&#12414;&#12379;&#12435;&#12290;", "Door:2": "&#12489;&#12450;&#12364;&#38283;&#12365;&#12414;&#12375;&#12383;&#12290;&#19968;&#26178;&#20572;&#27490;&#65288;&#12418;&#12375;&#12367;&#12399;&#12497;&#12540;&#12461;&#12531;&#12464;&#12522;&#12488;&#12521;&#12463;&#12488;&#65289;&#12375;&#12390;&#12356;&#12414;&#12377;&#12290;&#12522;&#12475;&#12483;&#12488;&#12377;&#12427;&#12392;&#12450;&#12521;&#12540;&#12512;&#12364;&#30330;&#29983;&#12375;&#12414;&#12377;&#12290;", "Door:3": "&#12489;&#12450;&#12364;&#38281;&#12414;&#12426;&#20877;&#38283;&#20013;&#12391;&#12377;&#12290;&#12522;&#12475;&#12483;&#12488;&#12377;&#12427;&#12392;&#12450;&#12521;&#12540;&#12512;&#12364;&#30330;&#29983;&#12375;&#12414;&#12377;&#12290;", "ALARM:1": "&#12495;&#12540;&#12489;&#12522;&#12511;&#12483;&#12488;&#12364;&#30330;&#29983;&#12375;&#12414;&#12375;&#12383;&#12290;&#31361;&#28982;&#12398;&#20572;&#27490;&#12395;&#12424;&#12426;&#12289;&#27231;&#26800;&#12398;&#20301;&#32622;&#12364;&#22833;&#12431;&#12428;&#12383;&#21487;&#33021;&#24615;&#12364;&#12354;&#12426;&#12414;&#12377;&#12290;&#20877;&#24230;&#12507;&#12540;&#12511;&#12531;&#12464;&#12434;&#24375;&#12367;&#12362;&#21223;&#12417;&#12375;&#12414;&#12377;&#12290;", "ALARM:2": "&#12477;&#12501;&#12488;&#12522;&#12511;&#12483;&#12488;&#12450;&#12521;&#12540;&#12512;&#12290;G&#12467;&#12540;&#12489;&#12398;&#21205;&#20316;&#12364;&#12510;&#12471;&#12531;&#12398;&#31227;&#21205;&#31684;&#22258;&#12434;&#36229;&#12360;&#12390;&#12356;&#12414;&#12377;&#12290;&#12450;&#12521;&#12540;&#12512;&#12434;&#23433;&#20840;&#12395;&#35299;&#38500;&#12391;&#12365;&#12414;&#12377;&#12290;", "ALARM:3": "&#21205;&#20316;&#20013;&#12398;&#12522;&#12475;&#12483;&#12488;&#12290; &#31361;&#28982;&#12398;&#20572;&#27490;&#12395;&#12424;&#12426;&#12289;&#27231;&#26800;&#12398;&#20301;&#32622;&#12364;&#22833;&#12431;&#12428;&#12383;&#21487;&#33021;&#24615;&#12364;&#12354;&#12426;&#12414;&#12377;&#12290;&#20877;&#24230;&#12507;&#12540;&#12511;&#12531;&#12464;&#12434;&#24375;&#12367;&#12362;&#21223;&#12417;&#12375;&#12414;&#12377;&#12290;", "ALARM:4": "&#12503;&#12525;&#12540;&#12502;&#12364;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;G38.2&#12392;G38.3&#12364;&#12488;&#12522;&#12460;&#12540;&#12373;&#12428;&#12390;&#12362;&#12425;&#12378;&#12289;G38.4&#12392;G38.5&#12364;&#12488;&#12522;&#12460;&#12540;&#12373;&#12428;&#12390;&#12356;&#12427;&#22580;&#21512;&#12289;&#12503;&#12525;&#12540;&#12502;&#12399;&#12503;&#12525;&#12540;&#12502;&#12469;&#12452;&#12463;&#12523;&#12434;&#38283;&#22987;&#12377;&#12427;&#21069;&#12395;&#20104;&#26399;&#12373;&#12428;&#12383;&#21021;&#26399;&#29366;&#24907;&#12395;&#12354;&#12426;&#12414;&#12379;&#12435;&#12290;", "ALARM:5": "&#12503;&#12525;&#12540;&#12502;&#12364;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;&#12503;&#12525;&#12540;&#12502;&#12364;G38.2&#12392;G38.4&#12398;&#12503;&#12525;&#12464;&#12521;&#12512;&#12373;&#12428;&#12383;&#31227;&#21205;&#37327;&#12391;&#12527;&#12540;&#12463;&#12395;&#25509;&#35302;&#12375;&#12414;&#12379;&#12435;&#12391;&#12375;&#12383;&#12290;", "ALARM:6": "&#12507;&#12540;&#12511;&#12531;&#12464;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;&#12450;&#12463;&#12486;&#12451;&#12502;&#12394;&#12507;&#12540;&#12511;&#12531;&#12464;&#12469;&#12452;&#12463;&#12523;&#12364;&#12522;&#12475;&#12483;&#12488;&#12373;&#12428;&#12414;&#12375;&#12383;&#12290;", "ALARM:7": "&#12507;&#12540;&#12511;&#12531;&#12464;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;&#12507;&#12540;&#12511;&#12531;&#12464;&#12469;&#12452;&#12463;&#12523;&#20013;&#12395;&#23433;&#20840;&#12489;&#12450;&#12364;&#38283;&#12365;&#12414;&#12375;&#12383;&#12290;", "ALARM:8": "&#12507;&#12540;&#12511;&#12531;&#12464;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;&#12522;&#12511;&#12483;&#12488;&#12473;&#12452;&#12483;&#12481;&#12434;&#12463;&#12522;&#12450;&#12377;&#12427;&#12383;&#12417;&#12398;&#31227;&#21205;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;pull-off&#36317;&#38626;&#12434;&#22679;&#12420;&#12377;&#12363;&#12289;&#37197;&#32218;&#12434;&#30906;&#35469;&#12375;&#12390;&#12367;&#12384;&#12373;&#12356;&#12290;", "ALARM:9": "&#12507;&#12540;&#12511;&#12531;&#12464;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;&#12507;&#12540;&#12511;&#12531;&#12464;&#31227;&#21205;&#36317;&#38626;&#20869;&#12391;&#12522;&#12511;&#12483;&#12488;&#12473;&#12452;&#12483;&#12481;&#12364;&#35211;&#12388;&#12363;&#12425;&#12394;&#12356;&#12290;&#26368;&#22823;&#31227;&#21205;&#37327;&#12434;&#22679;&#12420;&#12377;&#12289;pull-off&#36317;&#38626;&#12434;&#28187;&#12425;&#12377;&#12289;&#12414;&#12383;&#12399;&#37197;&#32218;&#12434;&#30906;&#35469;&#12375;&#12390;&#12415;&#12390;&#12367;&#12384;&#12373;&#12356;&#12290;", "error:1": "G&#12467;&#12540;&#12489;&#12399;&#12289;&#25991;&#23383;&#12392;&#20516;&#12391;&#27083;&#25104;&#12373;&#12428;&#12390;&#12356;&#12414;&#12377;&#12290;&#25991;&#23383;&#12364;&#35211;&#12388;&#12363;&#12426;&#12414;&#12379;&#12435;&#12391;&#12375;&#12383;&#12290;", "error:2": "&#26399;&#24453;&#12373;&#12428;&#12427;G&#12467;&#12540;&#12489;&#12398;&#20516;&#12364;&#35211;&#12388;&#12363;&#12425;&#12394;&#12356;&#12289;&#12414;&#12383;&#12399;&#25968;&#20516;&#12398;&#12501;&#12457;&#12540;&#12510;&#12483;&#12488;&#12364;&#28961;&#21177;&#12391;&#12377;&#12290;", "error:3": "Grbl '$' &#12471;&#12473;&#12486;&#12512;&#12467;&#12510;&#12531;&#12489;&#12364;&#35469;&#35672;&#12373;&#12428;&#12394;&#12363;&#12387;&#12383;&#12363;&#12289;&#12469;&#12509;&#12540;&#12488;&#12373;&#12428;&#12390;&#12356;&#12414;&#12379;&#12435;&#12290;", "error:4": "&#12503;&#12521;&#12473;&#12398;&#20516;&#12398;&#12501;&#12457;&#12540;&#12510;&#12483;&#12488;&#12395;&#23550;&#12375;&#12390;&#12510;&#12452;&#12490;&#12473;&#12398;&#20516;&#12434;&#21463;&#20449;&#12375;&#12414;&#12375;&#12383;&#12290;", "error:5": "&#12507;&#12540;&#12511;&#12531;&#12464;&#12469;&#12452;&#12463;&#12523;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;&#35373;&#23450;&#12391;&#12507;&#12540;&#12511;&#12531;&#12464;&#12364;&#26377;&#21177;&#12395;&#12394;&#12387;&#12390;&#12356;&#12414;&#12379;&#12435;&#12290;", "error:6": "&#26368;&#23567;&#12473;&#12486;&#12483;&#12503;&#12497;&#12523;&#12473;&#26178;&#38291;&#12399;3usec&#20197;&#19978;&#12391;&#12394;&#12369;&#12428;&#12400;&#12394;&#12426;&#12414;&#12379;&#12435;&#12290;", "error:7": "EEPROM &#12398;&#35501;&#12415;&#21462;&#12426;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;EEPROM &#12434;&#12487;&#12501;&#12457;&#12523;&#12488;&#20516;&#12395;&#33258;&#21205;&#24489;&#20803;&#12375;&#12414;&#12377;&#12290;", "error:8": "Grbl&#12398;'$'&#12467;&#12510;&#12531;&#12489;&#12399;&#12289;Grbl&#12364;IDLE&#12391;&#12394;&#12356;&#12392;&#20351;&#29992;&#12391;&#12365;&#12414;&#12379;&#12435;&#12290;", "error:9": "&#12450;&#12521;&#12540;&#12512;&#29366;&#24907;&#12414;&#12383;&#12399;&#12472;&#12519;&#12464;&#29366;&#24907;&#12398;&#38291;&#12399;&#12289;G&#12467;&#12540;&#12489;&#12467;&#12510;&#12531;&#12489;&#12399;&#12525;&#12483;&#12463;&#12373;&#12428;&#12390;&#12356;&#12414;&#12377;&#12290;", "error:10": "&#12477;&#12501;&#12488;&#12522;&#12511;&#12483;&#12488;&#12399;&#12289;&#12507;&#12540;&#12511;&#12531;&#12464;&#35373;&#23450;&#12434;&#26377;&#21177;&#12395;&#12375;&#12394;&#12356;&#12392;&#26377;&#21177;&#12395;&#12391;&#12365;&#12414;&#12379;&#12435;&#12290;", "error:11": "1&#34892;&#12354;&#12383;&#12426;&#12398;&#26368;&#22823;&#25991;&#23383;&#25968;&#12434;&#36229;&#12360;&#12414;&#12375;&#12383;&#12290;&#21463;&#20449;&#12375;&#12383;&#12467;&#12510;&#12531;&#12489;&#12399;&#23455;&#34892;&#12373;&#12428;&#12414;&#12379;&#12435;&#12391;&#12375;&#12383;&#12290;", "error:12": "Grbl '$'&#12398;&#35373;&#23450;&#20516;&#12399;&#12289;&#12473;&#12486;&#12483;&#12503;&#12524;&#12540;&#12488;&#12364;&#12469;&#12509;&#12540;&#12488;&#12373;&#12428;&#12390;&#12356;&#12427;&#26368;&#22823;&#20516;&#12434;&#36229;&#12360;&#12390;&#12375;&#12414;&#12356;&#12414;&#12377;&#12290;", "error:13": "&#23433;&#20840;&#25161;&#12364;&#38283;&#12356;&#12383;&#12371;&#12392;&#12434;&#26908;&#30693;&#12375;&#12289;&#12489;&#12450;&#29366;&#24907;&#12364;&#38283;&#22987;&#12373;&#12428;&#12414;&#12375;&#12383;&#12290;", "error:14": "&#12499;&#12523;&#12489;&#24773;&#22577;&#12414;&#12383;&#12399;&#12473;&#12479;&#12540;&#12488;&#12450;&#12483;&#12503;&#34892;&#12364;EEPROM&#12398;&#34892;&#38263;&#21046;&#38480;&#12434;&#36229;&#12360;&#12414;&#12375;&#12383;&#12290;&#34892;&#12399;&#20445;&#23384;&#12373;&#12428;&#12390;&#12356;&#12414;&#12379;&#12435;&#12290;", "error:15": "&#12472;&#12519;&#12464;&#31227;&#21205;&#20808;&#12364;&#12510;&#12471;&#12531;&#12398;&#31227;&#21205;&#37327;&#12434;&#36229;&#12360;&#12390;&#12356;&#12414;&#12377;&#12290;&#12472;&#12519;&#12464;&#12467;&#12510;&#12531;&#12489;&#12364;&#28961;&#35222;&#12373;&#12428;&#12414;&#12375;&#12383;&#12290;", "error:16": "&#12472;&#12519;&#12464;&#12467;&#12510;&#12531;&#12489;&#12395; '=' &#12364;&#12394;&#12356;&#12363;&#12289;&#31105;&#27490;&#12373;&#12428;&#12390;&#12356;&#12427;G&#12467;&#12540;&#12489;&#12364;&#21547;&#12414;&#12428;&#12390;&#12356;&#12414;&#12377;&#12290;", "error:17": "&#12524;&#12540;&#12470;&#12540;&#12514;&#12540;&#12489;&#12399;PWM&#20986;&#21147;&#12364;&#24517;&#35201;&#12391;&#12377;&#12290;", "error:20": "&#12469;&#12509;&#12540;&#12488;&#12373;&#12428;&#12390;&#12356;&#12394;&#12356;&#12363;&#12289;&#28961;&#21177;&#12394;G&#12467;&#12540;&#12489;&#12467;&#12510;&#12531;&#12489;&#12364;&#12502;&#12525;&#12483;&#12463;&#12391;&#35211;&#12388;&#12363;&#12426;&#12414;&#12375;&#12383;&#12290;", "error:21": "&#12502;&#12525;&#12483;&#12463;&#20869;&#12391;&#21516;&#12376;&#12514;&#12540;&#12480;&#12523;&#12464;&#12523;&#12540;&#12503;&#12363;&#12425;&#35079;&#25968;&#12398;G&#12467;&#12540;&#12489;&#12467;&#12510;&#12531;&#12489;&#12364;&#26908;&#20986;&#12373;&#12428;&#12414;&#12375;&#12383;&#12290;", "error:22": "&#36865;&#12426;&#36895;&#24230;&#12364;&#12414;&#12384;&#35373;&#23450;&#12373;&#12428;&#12390;&#12356;&#12394;&#12356;&#12363;&#12289;&#26410;&#23450;&#32681;&#12391;&#12377;", "error:23": "&#12502;&#12525;&#12483;&#12463;&#20869;&#12398;G&#12467;&#12540;&#12489;&#12467;&#12510;&#12531;&#12489;&#12399;&#25972;&#25968;&#20516;&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#12290;", "error:24": "&#12502;&#12525;&#12483;&#12463;&#20869;&#12391;&#35211;&#12388;&#12363;&#12387;&#12383;&#36600;&#21517;&#12434;&#24517;&#35201;&#12392;&#12377;&#12427;G&#12467;&#12540;&#12489;&#12467;&#12510;&#12531;&#12489;&#12364;1&#12388;&#20197;&#19978;&#12354;&#12426;&#12414;&#12377;&#12290;", "error:25": "&#32368;&#12426;&#36820;&#12373;&#12428;&#12383;G&#12467;&#12540;&#12489;&#12364;&#12502;&#12525;&#12483;&#12463;&#20869;&#12391;&#35211;&#12388;&#12363;&#12426;&#12414;&#12375;&#12383;&#12290;", "error:26": "&#36600;&#21517;&#12434;&#24517;&#35201;&#12392;&#12377;&#12427;G&#12467;&#12540;&#12489;&#12467;&#12510;&#12531;&#12489;&#12289;&#12414;&#12383;&#12399;&#12514;&#12540;&#12480;&#12523;&#29366;&#24907;&#12395;&#12362;&#12356;&#12390;&#12502;&#12525;&#12483;&#12463;&#20869;&#12395;&#36600;&#21517;&#12364;&#35211;&#12388;&#12363;&#12426;&#12414;&#12379;&#12435;&#12391;&#12375;&#12383;&#12290;", "error:27": "&#34892;&#30058;&#21495;&#12364;&#28961;&#21177;&#12391;&#12377;&#12290;", "error:28": "G&#12467;&#12540;&#12489;&#12467;&#12510;&#12531;&#12489;&#12395;&#24517;&#35201;&#12394;&#20516;&#12364;&#12354;&#12426;&#12414;&#12379;&#12435;&#12290;", "error:29": "G59.x&#12398;&#12527;&#12540;&#12463;&#24231;&#27161;&#31995;&#12395;&#12399;&#23550;&#24540;&#12375;&#12390;&#12356;&#12414;&#12379;&#12435;&#12290;", "error:30": "G53&#12399;G0&#12392;G1&#12398;&#12514;&#12540;&#12471;&#12519;&#12531;&#12514;&#12540;&#12489;&#12398;&#12415;&#35377;&#21487;&#12373;&#12428;&#12390;&#12356;&#12414;&#12377;&#12290;", "error:31": "&#36600;&#21517;&#12434;&#24517;&#35201;&#12392;&#12375;&#12394;&#12356;&#12467;&#12510;&#12531;&#12489;&#12420;&#12514;&#12540;&#12480;&#12523;&#29366;&#24907;&#12395;&#12362;&#12356;&#12390;&#12502;&#12525;&#12483;&#12463;&#20869;&#12395;&#36600;&#21517;&#12364;&#12415;&#12388;&#12363;&#12426;&#12414;&#12375;&#12383;&#12290;", "error:32": "G2&#12362;&#12424;&#12403;G3&#12398;&#20870;&#24359;&#12399;&#12289;&#23569;&#12394;&#12367;&#12392;&#12418;1&#12388;&#12398;&#24179;&#38754;&#20869;&#12398;&#36600;&#21517;&#12434;&#24517;&#35201;&#12392;&#12375;&#12414;&#12377;&#12290;", "error:33": "&#12514;&#12540;&#12471;&#12519;&#12531;&#12467;&#12510;&#12531;&#12489;&#12398;&#12479;&#12540;&#12466;&#12483;&#12488;&#12364;&#28961;&#21177;&#12391;&#12377;&#12290;", "error:34": "&#20870;&#24359;&#12398;&#21322;&#24452;&#12364;&#28961;&#21177;&#12391;&#12377;&#12290;", "error:35": "G2&#12362;&#12424;&#12403;G3&#12398;&#20870;&#24359;&#12399;&#12289;&#23569;&#12394;&#12367;&#12392;&#12418;1&#12388;&#12398;&#24179;&#38754;&#20869;&#12398;&#12458;&#12501;&#12475;&#12483;&#12488;&#12527;&#12540;&#12489;&#12434;&#24517;&#35201;&#12392;&#12375;&#12414;&#12377;&#12290;", "error:36": "&#26410;&#20351;&#29992;&#12398;&#20516;&#12364;&#12502;&#12525;&#12483;&#12463;&#12391;&#35211;&#12388;&#12363;&#12426;&#12414;&#12375;&#12383;&#12290;", "error:37": "G43.1 &#21205;&#30340;&#24037;&#20855;&#38263;&#12458;&#12501;&#12475;&#12483;&#12488;&#12399;&#12289;&#27083;&#25104;&#12373;&#12428;&#12383;&#24037;&#20855;&#38263;&#36600;&#12395;&#21106;&#12426;&#24403;&#12390;&#12425;&#12428;&#12390;&#12356;&#12414;&#12379;&#12435;&#12290;", "error:38": "&#12484;&#12540;&#12523;&#30058;&#21495;&#12364;&#12469;&#12509;&#12540;&#12488;&#12373;&#12428;&#12390;&#12356;&#12427;&#26368;&#22823;&#20516;&#12434;&#36229;&#12360;&#12390;&#12356;&#12414;&#12377;&#12290;", "error:60": "SD&#12398;&#12510;&#12454;&#12531;&#12488;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;", "error:61": "SD&#12459;&#12540;&#12489;&#12364;&#35501;&#12415;&#36796;&#12415;&#20013;&#12398;&#12383;&#12417;&#12398;&#12501;&#12449;&#12452;&#12523;&#12434;&#38283;&#12367;&#12371;&#12392;&#12364;&#12391;&#12365;&#12414;&#12379;&#12435;&#12391;&#12375;&#12383;", "error:62": "SD&#12459;&#12540;&#12489;&#12398;&#12487;&#12451;&#12524;&#12463;&#12488;&#12522;&#12434;&#38283;&#12367;&#12398;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;", "error:63": "SD&#12459;&#12540;&#12489;&#12398;&#12487;&#12451;&#12524;&#12463;&#12488;&#12522;&#12364;&#35211;&#12388;&#12363;&#12426;&#12414;&#12379;&#12435;", "error:64": "SD&#12459;&#12540;&#12489;&#12501;&#12449;&#12452;&#12523;&#12364;&#31354;&#12391;&#12377;", "error:70": "Bluetooth&#12398;&#38283;&#22987;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;", "Plate thickness": "&#12479;&#12483;&#12481;&#12503;&#12524;&#12540;&#12488;&#21402;&#12373;", "Show probe panel": "&#12503;&#12525;&#12540;&#12502;&#12497;&#12493;&#12523;&#12434;&#34920;&#31034;", "Start Probe": "&#12503;&#12525;&#12540;&#12499;&#12531;&#12464;&#12434;&#38283;&#22987;", "Touch status": "&#12479;&#12483;&#12481;&#12473;&#12486;&#12540;&#12479;&#12473;", "Value of maximum probe travel must be between 1 mm and 9999 mm !": "&#12503;&#12525;&#12540;&#12502;&#12398;&#26368;&#22823;&#31227;&#21205;&#37327;&#12398;&#20516;&#12399;1m&#65374;9999mm&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "Value of probe touch plate thickness must be between 0 mm and 9999 mm !": "&#12479;&#12483;&#12481;&#12503;&#12524;&#12540;&#12488;&#12398;&#21402;&#12373;&#12399;0&#65374;9999mm&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "Value of probe feedrate must be between 1 mm/min and 9999 mm/min !": "&#12503;&#12525;&#12540;&#12502;&#12398;&#36865;&#12426;&#36895;&#24230;&#12399;1&#65374;9999mm/min&#12391;&#12354;&#12427;&#24517;&#35201;&#12364;&#12354;&#12426;&#12414;&#12377;&#65281;", "Probe failed !": "&#12503;&#12525;&#12540;&#12502;&#22833;&#25943;&#65281;", "Probe result saved.": "&#12503;&#12525;&#12540;&#12499;&#12531;&#12464;&#32080;&#26524;&#20445;&#23384;&#12375;&#12414;&#12375;&#12383;&#12290;", "Browser:": "&#12502;&#12521;&#12454;&#12470;&#12540;:", "Probing...": "&#12503;&#12525;&#12540;&#12499;&#12531;&#12464;&#20013;...", "Step pulse, microseconds": "パルス間隔, microseconds", "Step idle delay, milliseconds": "&#12514;&#12540;&#12479;&#12540;&#12450;&#12452;&#12489;&#12523;&#12487;&#12451;&#12524;&#12452;, milliseconds", "Step port invert, mask2": "&#12473;&#12486;&#12483;&#12503;&#12497;&#12523;&#12473;&#21453;&#36578;, mask", "Direction port invert, mask": "&#26041;&#21521;&#21453;&#36578;, mask", "Step enable invert, boolean": "&#12452;&#12493;&#12540;&#12502;&#12500;&#12531;&#21453;&#36578;, boolean", "Limit pins invert, boolean": "&#12522;&#12511;&#12483;&#12488;&#12500;&#12531;&#21453;&#36578;, boolean", "Probe pin invert, boolean": "&#12503;&#12525;&#12540;&#12502;&#12500;&#12531;&#21453;&#36578;, boolean", "Status report, mask": "&#12473;&#12486;&#12540;&#12479;&#12473;&#22577;&#21578;&#20869;&#23481;, mask", "Junction deviation, mm": "&#12472;&#12515;&#12531;&#12463;&#12471;&#12519;&#12531;&#20559;&#24046;, mm", "Arc tolerance, mm": "&#20870;&#24359;&#20844;&#24046;, mm", "Report inches, boolean": "&#12452;&#12531;&#12481;&#34920;&#31034;, boolean", "Soft limits, boolean": "&#12477;&#12501;&#12488;&#12522;&#12511;&#12483;&#12488;, boolean", "Hard limits, boolean": "&#12495;&#12540;&#12489;&#12522;&#12511;&#12483;&#12488;, boolean", "Homing cycle, boolean": "&#12507;&#12540;&#12511;&#12531;&#12464;&#12469;&#12452;&#12463;&#12523;, boolean", "Homing dir invert, mask": "&#12507;&#12540;&#12511;&#12531;&#12464;&#26041;&#21521;&#21453;&#36578;, mask", "Homing feed, mm/min": "&#12507;&#12540;&#12511;&#12531;&#12464;&#35336;&#28204;&#26178;&#36865;&#12426;&#36895;&#24230;, mm/min", "Homing seek, mm/min": "&#12507;&#12540;&#12511;&#12531;&#12464;&#36895;&#24230;, mm/min", "Homing debounce, milliseconds": "&#12507;&#12540;&#12511;&#12531;&#12464;&#12481;&#12515;&#12479;&#12522;&#12531;&#12464;&#28961;&#35222;&#26178;&#38291;, milliseconds", "Homing pull-off, mm": "&#12507;&#12540;&#12511;&#12531;&#12464; pull-off&#31227;&#21205;&#37327;, mm", "Max spindle speed, RPM": "&#26368;&#22823;&#12473;&#12500;&#12531;&#12489;&#12523;&#22238;&#36578;&#25968;, RPM", "Min spindle speed, RPM": "&#26368;&#23567;&#12473;&#12500;&#12531;&#12489;&#12523;&#22238;&#36578;&#25968;, RPM", "Laser mode, boolean": "&#12524;&#12540;&#12470;&#12540;&#12514;&#12540;&#12489;, boolean", "X steps/mm": "X steps/mm", "Y steps/mm": "Y steps/mm", "Z steps/mm": "Z steps/mm", "X Max rate, mm/min": "X &#26368;&#22823;&#36895;&#24230;, mm/min", "Y Max rate, mm/min": "Y &#26368;&#22823;&#36895;&#24230;, mm/min", "Z Max rate, mm/min": "Z &#26368;&#22823;&#36895;&#24230;, mm/min", "X Acceleration, mm/sec^2": "X &#21152;&#36895;&#24230;, mm/sec^2", "Y Acceleration, mm/sec^2": "Y &#21152;&#36895;&#24230;, mm/sec^2", "Z Acceleration, mm/sec^2": "Z &#21152;&#36895;&#24230;, mm/sec^2", "X Max travel, mm": "X &#26368;&#22823;&#31227;&#21205;&#37327;, mm", "Y Max travel, mm": "Y &#26368;&#22823;&#31227;&#21205;&#37327;, mm", "Z Max travel, mm": "Z &#26368;&#22823;&#31227;&#21205;&#37327;, mm", "File extensions (use ; to separate)": "&#12501;&#12449;&#12452;&#12523;&#25313;&#24373;&#23376;(&#20998;&#38626;&#12395;&#12399;;&#12434;&#20351;&#29992;))", "Web Socket": "Web Socket" };