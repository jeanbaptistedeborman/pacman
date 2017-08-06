
(function() {
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(func) {
            func();
        };
}());
