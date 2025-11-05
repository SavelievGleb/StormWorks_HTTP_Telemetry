class Average {
    constructor(size = 5) {
        this.maxSize = size
        this.array = []
    }

    add(value) {
        if (this.array.length >= this.maxSize) {
            this.array.shift()
        }
        this.array.push(value)
    }

    get() {
        if (this.array.length === 0) return 0
        const sum = this.array.reduce((acc, curr) => { return acc + curr }, 0)
        return sum / this.array.length;
    }
}

module.exports = Average
