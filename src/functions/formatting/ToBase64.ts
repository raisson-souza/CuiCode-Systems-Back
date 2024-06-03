export default function ToBase64(str : string | number)
{
    const buffer = Buffer.from(String(str))
    return buffer.toString('base64')
}