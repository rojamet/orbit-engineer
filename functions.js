var compute_alpha = function(n)
{
    return (2 * Math.PI)/n;
}
var compute_c = function(a1, n)
{
    var alpha = compute_alpha(n);
    return 2 * a1 * Math.sin(alpha / 2);
}
var compute_h1 = function(a1, n)
{
    var alpha = compute_alpha(n);
    return a1 * Math.cos(alpha / 2);
}
var compute_h2 = function(a1, a2, n)
{
    var h1 = compute_h1(a1, n);
    return a2 - h1;
}
var farthest_distance = function(a1, a2, n)
{
    var h2 = compute_h2(a1, a2, n);
    var c = compute_c(a1, n);
    var d = Math.sqrt((c/2)*(c/2) + h2 * h2);
    return d;
}
console.log(compute_c(15e9, 4));
console.log(farthest_distance(15e9, 5e9, 4)/(1e9));
console.log(farthest_distance(15e9, 10e9, 4)/(1e9));
console.log(farthest_distance(15e9, 13e9, 4)/(1e9));
console.log(farthest_distance(15e9, 21e9, 4)/(1e9));
console.log(farthest_distance(15e9, 47e9, 4)/(1e9));
console.log(farthest_distance(15e9, 72e9, 4)/(1e9));
console.log(farthest_distance(15e9, 115e9, 4)/(1e9));
