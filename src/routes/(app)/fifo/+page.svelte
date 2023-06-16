<script lang="ts">
	import loading from "$lib/loading";
	import { onMount } from "svelte";
    import { writable } from "svelte/store";

    export let data;
    let { inventory } = data;

    const inventoryData = writable(inventory);

    function normalizeDate(date: Date) {
        const normalizedDateTime = new Date(date).toLocaleString('id-ID');
        return normalizedDateTime;
    }

    onMount(()=>{
        $loading = false
    })
</script>

<div class="h-screen flex-col pt-5 pr-6 pb-6 pl-3">
    <div class="card-min h-full">
        <div class="p-5 flex">
            <div class="text-lg">
                FIFO (First In First Out) &emsp;
            </div>
            <div class="h-7 w-[2px] bg-gray-300"></div>          
        </div>
        <div class="h-[calc(100%-10rem)] overflow-auto">
            <table class="w-[calc(100%-2.5rem)] text-center mx-5">
                <thead class="">
                    <tr>
                        <td class="pb-2 pt-5 bg-white sticky top-0 w-[20%]">Kode Barang</td>
                        <td class="pb-2 pt-5 bg-white sticky top-0 w-[30%]">Serial Number</td>
                        <td class="pb-2 pt-5 bg-white sticky top-0">Created Date</td>
                    </tr>
                </thead>
                <tbody>
                    {#each $inventoryData as inventData, i}
                        {#if inventData.details.length >= 1}
                            {#each inventData.details as detailed, j}
                                {#if j === 0}
                                    <tr>
                                        <td class="py-3" rowspan="{inventData.details.length}">{inventData.kode_barang}</td>
                                        <td class="py-3">{detailed.serial_number}</td>
                                        <td class="py-3">{normalizeDate(detailed.created_at)}</td>
                                    </tr>
                                {:else}
                                    <tr>
                                        <td class="py-3">{detailed.serial_number}</td>
                                        <td class="py-3">{normalizeDate(detailed.created_at)}</td>
                                    </tr>
                                {/if}
                            {/each}
                        {:else}
                            <tr>
                                <td class="py-3">{inventData.kode_barang}</td>
                                <td class="py-3">-</td>
                                <td class="py-3">-</td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="sticky w-full bottom-0 h-16 bg-white flex justify-center items-center gap-5">
            <div>1</div>
        </div>
    </div>
</div>