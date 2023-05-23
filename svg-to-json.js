const { parse } = require("svgson")
const fs = require('fs');

function buildIcon(svgObject) {

    const icon = {}

    icon.viewBox = svgObject.attributes.viewBox
    icon.fillNone = (svgObject.attributes.fill === 'none')

    for (const children of svgObject.children) {

        const nameChildren = `${children.name}s`

        if (!(nameChildren in icon)) {
            icon[nameChildren] = []
        }

        const attributes = Object.entries(children.attributes)
            .reduce((prev, [k, v]) => ({
                ...prev,
                [k.split('-').map((v, i) => ((i % 2) ? v.charAt(0).toUpperCase() + v.substring(1) : v)).join('')]: v
            }), {})

        icon[nameChildren].push(attributes)

    }

    return icon
}

async function getIcon(svg) {

    try {

        const result = await parse(svg)

        return buildIcon(result)

    } catch (err) {
        console.log(err)
    }

}

async function init() {

    const path = process?.argv[2]

    if (path) {

        try {

            const svg = fs.readFileSync(path, 'utf8');

            icon = await getIcon(svg)

            console.log(icon)

        } catch (err) {
            console.error(err);
        }

    }
}

init()