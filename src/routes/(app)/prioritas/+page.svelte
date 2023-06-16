<script lang="ts">
	import loading from "$lib/loading";
	import { onMount } from "svelte";
    import { writable } from "svelte/store";

    import SortAscending from "svelte-material-icons/SortAscending.svelte";
    import SortDescending from "svelte-material-icons/SortDescending.svelte";

    export let data;
    let { priorities } = data;

    const prioritiesSort = writable(priorities);

    onMount(()=>{
        $loading = false
    })

    let sortAsc = false;
    let sortDesc = false;

    function handleAscSort() {
        prioritiesSort.update(items => {
            const sortedData = [...items].sort((a, b) => a.priority - b.priority);
            sortAsc = !sortAsc;
            sortDesc = false;
            return sortedData;
        });
    }

    function handleDescSort() {
        prioritiesSort.update(items => {
            const sortedData = [...items].sort((a, b) => b.priority - a.priority);
            sortDesc = !sortDesc;
            sortAsc = false;
            return sortedData;
        });
    }
</script>

<div class="h-screen flex-col pt-5 pr-6 pb-6 pl-3">
    <div class="card-min h-full">
        <div class="p-5 flex">
            <div class="text-lg">
                Prioritas Sort &emsp;
            </div>
            <div class="h-7 w-[2px] bg-gray-300"></div>          
        </div>
        <div class="h-[calc(100%-10rem)] overflow-auto">
            <table class="w-[calc(100%-2.5rem)] text-center mx-5">
                <thead class="">
                    <tr>
                        <td class="pb-2 pt-5 bg-white sticky top-0">ID Order</td>
                        <td class="pb-2 pt-5 bg-white sticky top-0">ID Pengirim</td>
                        <td class="pb-2 pt-5 bg-white sticky top-0">ID Penerima</td>
                        <td class="pb-2 pt-5 bg-white sticky top-0">Alamat</td>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <td class="pb-2 pt-5 bg-white sticky top-0 z-10">
                            {#if sortAsc}
                                <button class="flex flex-row items-center mx-auto" on:click={(e) => handleDescSort()}>
                                    <h1 class="">
                                        Prioritas
                                    </h1>
                                    <SortAscending color={'#000000'} width={30} height={30}></SortAscending>
                                    <!-- {#if sortDesc}
                                    <SortDescending color={'#000000'} width={30} height={30}></SortDescending>
                                    {/if} -->
                                </button>
                            {/if}
                            {#if sortDesc}
                                <button class="flex flex-row items-center mx-auto" on:click={(e) => handleAscSort()}>
                                    <h1 class="">
                                        Prioritas
                                    </h1>
                                    <SortDescending color={'#000000'} width={30} height={30}></SortDescending>
                                </button>
                            {/if}
                            {#if !sortAsc && !sortDesc}
                            <button class="flex flex-row items-center mx-auto" on:click={(e) => handleAscSort()}>
                                <h1 class="">
                                    Prioritas
                                </h1>
                            </button>
                            {/if}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {#each $prioritiesSort as x, i}
                    <tr>
                        <td class="py-3">{x.id_order}</td>
                        <td class="py-3">{x.id_pengirim}</td>
                        <td class="py-3">{x.id_penerima}</td>
                        <td class="py-3">{x.alamat}</td>
                        <td class="py-3">{x.priority}</td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="sticky w-full bottom-0 h-16 bg-white flex justify-center items-center gap-5">
            <div>1</div>
        </div>
    </div>
</div>