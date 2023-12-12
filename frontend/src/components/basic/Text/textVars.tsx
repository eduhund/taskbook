type textParams = {
    size: "s" | "m" | "l" | "xl" | "2xl" | "3xl" | "4xl"
    view?: "link" | "alert" | "primary" | "brand" | "ghost" | "linkMinor" | "secondary" | "success" | "warning" | undefined
    lineHeight: "2xs" | "xs" | "s" | "m" | "l"
    weight?: "regular" | "semibold" | "bold"
    spacing?: "xs"
}

const TEXT_1: textParams = {
    size: "4xl",
    lineHeight: "xs",
    weight: "bold"
}

const TEXT_2: textParams = {
    size: "3xl",
    lineHeight: "xs",
    weight: "semibold",
}

const TEXT_3: textParams = {
    size: "2xl",
    lineHeight: "xs",
    weight: "semibold"
}

const TEXT_4: textParams = {
    size: "xl",
    lineHeight: "xs",
    weight: "semibold"
}

const TEXT_5: textParams = {
    size: "m",
    lineHeight: "m",
    weight: "semibold"
}

const TEXT_6: textParams = {
    size: "m",
    lineHeight: "m"
}

const TEXT_7: textParams = {
    size: "s",
    lineHeight: "m"
}

export {TEXT_1, TEXT_2, TEXT_3, TEXT_4, TEXT_5, TEXT_6, TEXT_7}