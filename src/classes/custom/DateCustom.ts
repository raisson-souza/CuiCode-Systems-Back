import StringCustom from "./StringCustom"

class DateCustom extends Date
{
    toSqlComparison()
    {
        const month = StringCustom.fillZeros(this.toLocaleString().split("/")[1])
        const day = StringCustom.fillZeros(this.toLocaleString().split("/")[0])
        const hour = StringCustom.fillZeros(this.toLocaleString().split(" ")[1].split(":")[0])
        const minute = StringCustom.fillZeros(this.toLocaleString().split(" ")[1].split(":")[1])
        const second = StringCustom.fillZeros(this.toLocaleString().split(" ")[1].split(":")[2])
        const milissecond = StringCustom.fillZeros(this.getMilliseconds())
        return `${ this.getFullYear() }-${ month }-${ day } ${ hour }:${ minute }:${ second }.${ milissecond }`
    }
}

export default DateCustom