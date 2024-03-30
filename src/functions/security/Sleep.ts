async function Sleep(s : number = 3) : Promise<void> {
    await new Promise((r) => { setTimeout(r, s * 1000) })
}

export default Sleep