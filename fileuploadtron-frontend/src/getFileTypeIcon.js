
function getFileTypeIcon(filetype) {
    const iconsFolderPath = `${process.env.REACT_APP_STATIC_URL}file_icons/`;
    const fileExtensionGroups = {
        rasterImageTypes: new Set(["JPEG", "JPG", "PNG", "GIF", "BMP","TIFF",
            "TIF", "PSD", "TGA", "ICO", "PBM", "PGM",
            "PPM", "WEBP", "EXIF", "PCX", "JP2", "J2K",
            "JPE", "JFIF", "DNG", "RAW", "SRW", "NEF",
            "CR2", "ORF", "ARW", "RW2", "RAF", "DCR", "MOS", "HEIC"]),
        compressedTypes: new Set(["ZIP", "GZ", "BZ2", "RAR", "7Z", "XZ", "Z", "LZIP", "LZ4", "ZST", "ARJ", "ISO", "JAR", "CAB"]),
        executableTypes: new Set(["EXE", "MSI", "APP"]),
        videoTypes: new Set(["MP4", "AVI", "MKV", "MOV", "FLV", "WMV", "WEBM",
            "M4V", "MPG", "MPEG", "3GP", "RM", "VOB", "OGV", "TS", "M2TS", "ASF",
            "DIVX", "XVID", "RMVB", "OGM", "MTS", "F4V", "MPV", "MP2", "MPG2",
            "MPEG2", "MPEG4", "H264", "H265", "HEVC", "MJPEG", "OGG", "QT", "SWF", "FLV",
            "M2V", "M1V", "M2P", "WM", "WMX", "WVX", "MP2V", "DV", "AMV", "MOD",
            "TOD", "DVR-MS", "MPE", "MPA", "3G2"]),
        audioTypes: new Set(["3GP","AAC","AIF","AIFF","AMR","AU",
            "FLAC","M4A","M4R","MID","MIDI","MP3","MPA","OGA","OGG",
            "OPUS","RA","WAV","WMA","WV"]),
        programmingLanguageType: new Set(["C", "H", "CPP", "CXX", "CC", "C++", "HPP", "HXX", "HH", "H++",
            "JAVA", "JS", "TS", "PHP", "PY", "RB", "SQL","C#", "CS", "R",
            "SWIFT", "GO", "PERL", "BASH", "SH", "BATCH", "PS1", "PSM1",
            "VBS", "BAT", "PL", "SCALA", "LUA", "DART", "RUST", "KOTLIN",
            "SCHEME", "LISP", "COBOL", "ADA", "FORTRAN", "PROLOG", "ERL",
            "AS", "VHDL", "VERILOG", "MATLAB", "M", "ABAP", "APEX", "HASKELL",
            "ELM", "COFFEESCRIPT", "GROOVY", "RUBY", "PERL6", "SWIG", "D",
            "E", "F", "N", "JSX", "TSX", "PDE", "ARDUINO", "INO", "PWN", "AMX"]),
        markupLanguageTypes: new Set(["HTML","XML","JSON","YAML","TOML","CSS", "INC"]),
        plainTextTypes: new Set(["TXT"]),
        pdfTypes: new Set(["PDF"]),
        svgTypes: new Set(["SVG"]),
        aiTypes: new Set(["AI"]),
    }
    const foundInGroup = Object.keys(fileExtensionGroups).find(extensionGroup => 
        fileExtensionGroups[extensionGroup].has(filetype.toUpperCase()));

    const ga = {
        rasterImageTypes: `${iconsFolderPath}image.svg`,
        compressedTypes: `${iconsFolderPath}zip.svg`,
        executableTypes: `${iconsFolderPath}disc.svg`,
        videoTypes: `${iconsFolderPath}video.svg`,
        audioTypes: `${iconsFolderPath}music.svg`,
        programmingLanguageType: `${iconsFolderPath}code.svg`,
        markupLanguageTypes: `${iconsFolderPath}markup.svg`,
        plainTextTypes: `${iconsFolderPath}text.svg`,
        pdfTypes: `${iconsFolderPath}pdf.svg`,
        svgTypes: `${iconsFolderPath}svg.svg`,
        aiTypes: `${iconsFolderPath}ai.svg`,
        'undefined': `${iconsFolderPath}document.svg`,
    }
    return ga[foundInGroup];
}

export default getFileTypeIcon;