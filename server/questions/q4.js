function foo(x) {
    let y = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < x.length; i++) {
        if (x[i] > y) {
            y = x[i];
        }
    }

    return y;
}