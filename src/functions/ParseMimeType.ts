function ParseMimeType(mimeType: string)
{
    return mimeType.split('/')[1]
}
export default ParseMimeType