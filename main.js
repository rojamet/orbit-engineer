/**
 * @constant {number} G Gravitational constant
 */
const G = 6.67408e-11;
/**
 * @typedef {object} celestialObject
 * @property {string} name
 * @property {number} mass
 * @property {number} radius
 */
/**
 * @constant {[celestialObject]} refObjects
 */
const refObjects = [
    {
        name: "Kerbol",
        mass: 1.7565459e28,
        radius: 621600000
    },
    {
        name: "Moho",
        mass: 2.5263314e21,
        radius: 250000
    },
    {
        name: "Eve",
        mass: 1.2243980e23,
        radius: 700000
    },
    {
        name: "Kerbin",
        mass: 5.2915158e22,
        radius: 600000
    },
    {
        name: "Duna",
        mass: 4.5154270e21,
        radius: 320000
    },
    {
        name: "Dres",
        mass: 3.2190937e20,
        radius: 138000
    },
    {
        name: "Jool",
        mass: 4.2332127e24,
        radius: 6000000
    },
    {
        name: "Eeloo",
        mass: 1.1149224e21,
        radius: 210000
    },
    {
        name: "Other",
        mass: NaN,
        radius: NaN
    }
];
/**
 * @function rounder Rounds x to n decimal places
 * @param {number} x Number to round
 * @param {number} n Decimal places
 * @returns {number} Rounded number
 */
var rounder = function(x, n = 20)
{
    return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
}
/**
 * @function a_to_T Computes orbital period from semi-major axis
 * @param {number} a Semi-major axis 
 * @param {number} M Reference body mass
 * @returns {number} Orbital period
 */
var a_to_T = function(a, M)
{
    var T = Math.pow(Math.pow(a, 3) * 4 * Math.pow(Math.PI, 2) / (G * M), 1/2);
    return rounder(T);
}
/**
 * @function T_to_a Computes semi-major axis from orbital period
 * @param {number} T Orbital period
 * @param {number} M Reference body mass
 * @returns {number} Semi-major axis
 */
var T_to_a = function(T, M)
{
    var a = Math.pow(Math.pow(T, 2) * G * M / (4 * Math.pow(Math.PI, 2)), 1/3);
    return rounder(a);
}
/**
 * @function Alt_to_T Computes orbital period from altitude
 * @param {number} Alt Altitude
 * @param {number} M Reference body mass
 * @param {number} R Reference body radius
 * @returns {number} Orbital period
 */
var Alt_to_T = function(Alt, M, R)
{
    var a = Alt + R;
    return a_to_T(a, M);
}
/**
 * @function T_to_Alt Computes altitude from orbital period
 * @param {number} T Orbital period
 * @param {number} M Reference body mass
 * @param {number} R Reference body radius
 * @returns {number} Altitude
 */
var T_to_Alt = function(T, M, R)
{
    return T_to_a(T, M) - R;
}
/**
 * @function kerbal_Time Put time into readable kerbal time format
 * @param {number} t Time in seconds
 * @returns {string} Formatted time
 */
var kerbal_Time = function(t)
{
    var days, hours, mins, secs;
    secs = t % 60;
    t -= secs;
    t /= 60;
    mins = t % 60;
    t -= mins;
    t /= 60;
    hours = t % 6;
    t -= hours;
    t /= 6;
    days = t;
    return(`${days} days, ${hours} hours, ${mins} mins, ${secs} secs`);
}
/**
 * @function getVar
 * @param {string} name
 * @returns {number}
 */
var getVar = function(name)
{
    return Number($(`#${name}`).val())
}

var c_to_e = function(c, a)
{
    return rounder(c/a);
}
var e_to_c = function(e, a)
{
    return rounder(e*a);
}
var e_to_aps = function(e, a, R)
{
    a = Number(a);
    var c = e_to_c(e, a);
    var Pe = a - c;
    Pe -= R;
    var Ap = a + c;
    Ap -= R;
    return {Ap: Ap, Pe: Pe};
}
var aps_to_e = function(Pe, Ap, R)
{
    var a = (Pe + Ap + 2 * R) / 2;
    var c = a - (Pe + R);
    var e = c_to_e(c, a);
    return e;
}
var Pe_to_c = function(Pe, a, R)
{
    return a - (Pe + R);
}
var c_to_Pe = function(c, a, R)
{
    return a - (c + r);
}
var Ap_to_c = function(Ap, a, R)
{
    return (Ap + R) - a;
}
var c_to_Ap = function(c, a, R)
{
    return c + a - R;
}
var generateObjectsMenu = function()
{
    var e;
    var opt;
    for(var i = 0; i < refObjects.length; i++)
    {
        e = refObjects[i];
        opt = new Option(e.name, e.name);
        $(opt).html(e.name);
        $("#select-body").append(opt);
    }
}
var objectsMenuChanged = function()
{
    var bodyName = String($("#select-body").val());
    if(bodyName == "Other")
        return;
    var body = refObjects.find((e) => e.name == bodyName);
    $("#R").val(rounder(body.radius));

    var R = getVar("R");
    var a = getVar("a");
    var Alt = a - R;
    compute_orbit(a, R);
    $("#Alt").val(Alt);
    check_altitude();

    $("#M").val(rounder(body.mass));
    
    var M = getVar("M");
    var T = a_to_T(a, M);
    $("#T").val(T);
    update_time();
}
var getLock = function()
{
    return String($("input[name=lock]:checked").val());
}

var compute_orbit = function(a, R)
{
    var lock = getLock();
    switch(lock)
    {
        case "e_lock":
            var e = getVar("e");
            var aps = e_to_aps(e, a, R);
            var Ap = aps.Ap;
            var Pe = aps.Pe;
            $("#Ap").val(Ap);
            $("#Pe").val(Pe);
            break;
        case "Ap_lock":
            var Ap = getVar("Ap");
            var Pe = (2 * a) - (2 * R) - Ap;
            checkApsides(Pe, Ap);
            Ap = getVar("Ap");
            Pe = getVar("Pe");
            var e = aps_to_e(Pe, Ap, R);
            $("#e").val(e);
            break;
        case "Pe_lock":
            var Pe = getVar("Pe");
            var Ap = (2 * a) - (2 * R) - Pe;
            checkApsides(Pe, Ap);
            Ap = getVar("Ap");
            Pe = getVar("Pe");
            var e = aps_to_e(Pe, Ap, R);
            $("#e").val(e);
            break;
    }
}
var R_changed = function()
{
    var R = getVar("R");
    var a = getVar("a");
    var Alt = a - R;
    $("#select-body").val("Other")
    compute_orbit(a, R);
    $("#Alt").val(Alt);
    check_altitude();
}
var M_changed = function()
{
    var M = getVar("M");
    var a = getVar("a");
    var T = a_to_T(a, M);
    $("#select-body").val("Other");
    $("#T").val(T);
    update_time();
}
var Alt_changed = function()
{
    var R = getVar("R");
    var M = getVar("M");
    var Alt = getVar("Alt");
    var a = R + Alt;

    compute_orbit(a, R);
    
    $("#a").val(a);
    $("#T").val(Alt_to_T(Alt, M, R));
    check_altitude();
    update_time();
}
var a_changed = function()
{
    var R = getVar("R");
    var M = getVar("M");
    var a = getVar("a");
    var Alt = a - R;
    var T = a_to_T(a, M);
    compute_orbit(a, R);
    $("#Alt").val(Alt);
    $("#T").val(T);
    check_altitude();
    update_time();
}
var T_changed = function()
{
    var R = getVar("R");
    var M = getVar("M");
    var T = getVar("T");
    var a = T_to_a(T, M);
    var Alt = T_to_Alt(T, M, R);
    /*var lock = getLock();
    switch(lock)
    {
        case "e_lock":
            var e = getVar("e");
            var {Ap, Pe} = e_to_aps(e, a, R);
            checkApsides(Pe, Ap);
            break;
        case "Ap_lock":
            var Ap = getVar("Ap");
            var Pe = (2 * a) - (2 * R) - Ap;
            checkApsides(Pe, Ap);
            Ap = getVar("Ap");
            Pe = getVar("Pe");
            var e = aps_to_e(Pe, Ap, R);
            $("#e").val(e);
            break;
        case "Pe_lock":
            var Pe = getVar("Pe");
            var Ap = (2 * a) - (2 * R) - Pe;
            checkApsides(Pe, Ap);
            Ap = getVar("Ap");
            Pe = getVar("Pe");
            var e = aps_to_e(Pe, Ap, R);
            $("#e").val(e);
            break;
    }*/
    compute_orbit(a, R);
    $("#Alt").val(Alt);
    check_altitude();
    update_time();
}
var e_changed = function()
{
    var lock = getLock();
    var e = getVar("e");
    var R = getVar("R");
    var M = getVar("M");
    switch(lock)
    {
        case "e_lock":
            var a = getVar("a");
            var aps = e_to_aps(e, a, R);

            checkApsides(aps.Pe, aps.Ap);
            check_altitude();
            break;
        case "Ap_lock":
            var Ap = getVar("Ap");
            var a = (Ap + R) / (1 + e);
            var Pe = (2 * a) - (2 * R) - Ap;
            var alt = a - R;
            var T = a_to_T(a, M);
            checkApsides(rounder(Pe), rounder(Ap));
            $("#alt").val(rounder(alt));
            $("#a").val(rounder(a));
            $("#T").val(rounder(T));
            update_time();
            check_altitude();
            break;
        case "Pe_lock":
            var Pe = getVar("Pe");
            var a = (Pe + R) / (1 - e);
            var Ap = (2 * a) - (2 * R) - Pe;
            var alt = a - R;
            var T = a_to_T(a, M);
            checkApsides(rounder(Pe), rounder(Ap));
            $("#alt").val(rounder(alt));
            $("#a").val(rounder(a));
            $("#T").val(rounder(T));
            update_time();
            check_altitude();
            break;
    }
}
var Ap_changed = function()
{
    var lock = getLock();
    var Ap = getVar("Ap");
    var R = getVar("R");
    var M = getVar("M");
    switch(lock)
    {
        case "e_lock":
            var e = getVar("e");
            var a = (Ap + R) / (1 + e);
            var Pe = (2 * a) - (2 * R) - Ap;
            var alt = a - R;
            var T = a_to_T(a, M);
            checkApsides(rounder(Pe), rounder(Ap));
            $("#alt").val(rounder(alt));
            $("#a").val(rounder(a));
            $("#T").val(rounder(T));
            update_time();
            check_altitude();
            break;
        case "Ap_lock":
            var a = getVar("a");
            var Pe = (2 * a) - (2 * R) - Ap;
            checkApsides(rounder(Pe), rounder(Ap));
            Pe = getVar("Pe");
            Ap = getVar("Ap");
            var e = aps_to_e(Pe, Ap, R);
            $("#e").val(e);
            check_altitude();
            break;
        case "Pe_lock":
            var Pe = getVar("Pe");
            var a = (Ap + Pe + (2 * R)) / 2;
            var alt = a - R;
            var T = a_to_T(a, M);
            checkApsides(rounder(Pe), rounder(Ap));
            Pe = getVar("Pe");
            Ap = getVar("Ap");
            var e = aps_to_e(Pe, Ap, R);
            $("#e").val(e);
            $("#alt").val(rounder(alt));
            $("#a").val(rounder(a));
            $("#T").val(rounder(T));
            update_time();
            check_altitude();
            break;
    }
}
var Pe_changed = function()
{
    var lock = getLock();
    var Pe = getVar("Pe");
    var R = getVar("R");
    var M = getVar("M");
    switch(lock)
    {
        case "e_lock":
            var e = getVar("e");
            var a = (Pe + R) / (1 - e);
            var Ap = (2 * a) - (2 * R) - Pe;
            var alt = a - R;
            var T = a_to_T(a, M);
            checkApsides(rounder(Pe), rounder(Ap));
            $("#alt").val(rounder(alt));
            $("#a").val(rounder(a));
            $("#T").val(rounder(T));
            update_time();
            check_altitude();
            break;
        case "Pe_lock":
            var a = getVar("a");
            var Ap = (2 * a) - (2 * R) - Pe;
            checkApsides(rounder(Pe), rounder(Ap));
            Pe = getVar("Pe");
            Ap = getVar("Ap");
            var e = aps_to_e(Pe, Ap, R);
            $("#e").val(e);
            check_altitude();
            break;
        case "Ap_lock":
            var Ap = getVar("Ap");
            var a = (Ap + Pe + (2 * R)) / 2;
            var alt = a - R;
            var T = a_to_T(a, M);
            checkApsides(rounder(Pe), rounder(Ap));
            Pe = getVar("Pe");
            Ap = getVar("Ap");
            var e = aps_to_e(Pe, Ap, R);
            $("#e").val(e);
            $("#alt").val(rounder(alt));
            $("#a").val(rounder(a));
            $("#T").val(rounder(T));
            update_time();
            check_altitude();
            break;
    }
}
var check_altitude = function()
{
    var Alt = getVar("Alt");
    if(Alt <= 0)
        $("#alt-warning").show();
    else
        $("#alt-warning").hide();
    var Pe = getVar("Pe");
    if(Pe <= 0)
        $("#apsis-warning").show();
    else
        $("#apsis-warning").hide();
}
var checkApsides = function(Pe, Ap)
{
    if(Ap < Pe)
    {
        $("#Ap").val(Pe);
        $("#Pe").val(Ap);
        var lock = getLock();
        switch(lock)
        {
            case "Ap_lock":
                $("#Pe_lock").prop("checked", true);
                break;
            case "Pe_lock":
                $("#Ap_lock").prop("checked", true);
                break;
        }
    }
    else
    {
        $("#Ap").val(Ap);
        $("#Pe").val(Pe);
    }
}
var update_time = function()
{
    var T = getVar("T");
    $("#verbose-T").text(kerbal_Time(T));
}
var init_page = function()
{
    generateObjectsMenu();
    $("#select-body").val("Kerbin");
    a_changed();
}
