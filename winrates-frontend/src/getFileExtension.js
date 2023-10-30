function getFileExtension (filename) {
    const fileExtDot = filename.lastIndexOf('.');
    if (fileExtDot >= 0) {
        return filename.slice(fileExtDot + 1);
    } 
    return "";
}

export default getFileExtension;