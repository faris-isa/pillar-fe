<script lang="ts">
    import "../../app.css";
    import loading from "$lib/loading"
    import { navigating } from '$app/stores';
	import { onMount } from "svelte";

    import ArchiveArrowDown from "svelte-material-icons/ArchiveArrowDown.svelte";
    import ArchiveArrowUpOutline from "svelte-material-icons/ArchiveArrowUpOutline.svelte";
    import MapMarkerDistance from "svelte-material-icons/MapMarkerDistance.svelte";
    import Logout from "svelte-material-icons/Logout.svelte";

    let defaultColor = "#000000";
    let activeColor = "dodgerblue";
    let iconWidth = 40
    let iconHeight = 40

    let isHidden = true
    function onMenuHover(e: Event){
        isHidden = false
    }
    function onMenuUnhover(e: Event){
        isHidden = true
    }
    let activeLink = {
        'fifo' : false,
        'lifo': false,
        'prioritas': false
    }

    let statloading = false

    let timeoutloading: any = undefined

    $: if($navigating){
        if(timeoutloading) clearTimeout(timeoutloading)
        $loading = true
        timeoutloading = setTimeout(()=>{
            statloading = true
        }, 1000)
        let splitOld: any = $navigating.from?.url.pathname.split("/")
        let maksArrayOld = splitOld.length;
        let oldPath = splitOld[maksArrayOld-1]
        if(Object.hasOwn(activeLink, oldPath)){
            oldPath = oldPath;
        } else {
            oldPath = splitOld[maksArrayOld-2]
        }
        let splitNew: any = $navigating.to?.url.pathname.split("/")
        let maksArrayNew = splitNew.length;
        let newPath = splitNew[maksArrayNew-1]
        if(Object.hasOwn(activeLink, newPath)){
            newPath = newPath;
        } else {
            newPath = splitNew[maksArrayNew-2]
        }
        if(oldPath !== newPath){
            //@ts-ignore
            activeLink[oldPath] = false
            //@ts-ignore
            activeLink[newPath] = true
        }
    }

    $: if($loading == false){
        // statloading = true 
        // console.log(timeoutloading)
        if(timeoutloading) clearTimeout(timeoutloading)
        statloading = false
    }
    // $: if(!$loading){
    //     statloading = false
    // }

    onMount(()=>{
        let split = window.location.pathname.split("/")
        let maksArray = split.length;
        let earlyPath = split[maksArray-1]
        if(Object.hasOwn(activeLink, earlyPath)){
            earlyPath = earlyPath;
        } else {
            earlyPath = split[maksArray-2]
        }
        //@ts-ignore
        activeLink[earlyPath] = true
    })
    

    
</script>

<style>

</style>
<div class="lg:grid grid-cols-10">
    <div class="col-span-1 items-center flex flex-col space-y-5 mt-5 relative z-20">
        
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <nav class="flex flex-col space-y-2 w-full left-0 h-screen items-center" on:mouseover={onMenuHover} on:mouseleave={onMenuUnhover}>
            <a class="menu-btn" href={activeLink["fifo"] ? 'javascript:void(0)': '/fifo'}>
                <ArchiveArrowDown  color={activeLink["fifo"] ? activeColor : defaultColor} width={iconWidth} height={iconHeight}></ArchiveArrowDown>
            </a>
            <a class="menu-btn" href={activeLink["lifo"] ? 'javascript:void(0)': '/lifo'}>
                <ArchiveArrowUpOutline  color={activeLink["lifo"] ? activeColor : defaultColor} width={iconWidth} height={iconHeight}></ArchiveArrowUpOutline>
            </a>
            <a class="menu-btn" href={activeLink["prioritas"] ? 'javascript:void(0)': '/prioritas'}>
                <MapMarkerDistance  color={activeLink["prioritas"] ? activeColor : defaultColor} width={iconWidth} height={iconHeight}></MapMarkerDistance>
            </a>
            <form action="/logout" method="POST">
                <button class="btn btn-primary">
                    <Logout color={defaultColor} width={iconWidth} height={iconHeight}></Logout>
                </button>
            </form>
        </nav>
    </div>
    <div class="absolute ml-[8%] z-10 flex flex-col space-y-10 mt-[2.5rem] {isHidden ? "hidden" : "block"}">
        <div class="" style="color:{activeLink["fifo"] ? activeColor : defaultColor}">FIFO</div>
        <div class="" style="color:{activeLink["lifo"] ? activeColor : defaultColor}">LIFO</div>
        <div class="" style="color:{activeLink["prioritas"] ? activeColor : defaultColor}">Prioritas</div>
    </div>
    <div class="col-span-9 {isHidden ? "" : "ml-[8%]"}">
        <slot />
    </div>
    <div class=" fixed h-screen w-screen opacity-50 {statloading ? "flex" : "hidden"} justify-center items-center z-50" style="background-color: rgba(50,50,50, 0.7)">
        <span class="text-white text-2xl">Loading...</span>
    </div>
</div>
