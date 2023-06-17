<script lang="ts">
    import { applyAction, enhance } from "$app/forms";
	import loading from "$lib/loading";
	import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Select from 'svelte-select';
    import PlusCircle from "svelte-material-icons/PlusCircle.svelte";
    import MinusCircle from "svelte-material-icons/MinusCircle.svelte";

    export let data: any;
    export let form: any;
    let { option, inventory } = data;

    const inventoryData = writable(inventory);
    interface selectOption {
        value: string;
        label: string;
    }

    const collections: selectOption[] = [];

    let selected: null = null, removeMode = false, addMode = false;

    function normalizeDate(date: Date) {
        const normalizedDateTime = new Date(date).toLocaleString('id-ID');
        return normalizedDateTime;
    }

    option.forEach((item: { kode_barang: string }) => {
        const a1: selectOption = {
            value: item.kode_barang,
            label: item.kode_barang,
        };
        collections.push(a1);
    });

    const addTable = (data: any) => {
        inventoryData.update(item => {
            const matchingItem = item.find((item2: { kode_barang: string; }) => item2.kode_barang === data.kode_barang);

            if (matchingItem) {
                const newItem = {
                    id: data.id,
                    kode_barang: data.kode_barang,
                    serial_number: data.serial_number,
                    out_date: data.out_date,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    deleted_at: data.deleted_at
                };

                const updatedItem = {
                    ...matchingItem,
                    details: [...matchingItem.details, newItem]
                };

                const updatedInventory = item.map((item2: { kode_barang: string; }) => {
                    if (item2.kode_barang === data.kode_barang) {
                        return updatedItem;
                    }
                return item2;
                });

                return updatedInventory;
            }

            return item;
        });
    }

    const minusTable = (data: any) => {
        inventoryData.update(item => {
            const filtered = item.map((item2: { details: any[] }) => {
                const details = item2.details.filter(detail => detail.id !== data.id);
                return { ...item2, details };
            });
            return filtered;
        });
    }

    onMount(()=>{
        $loading = false
    })
</script>

<div class="h-screen flex-col pt-5 pr-6 pb-6 pl-3">
    <div class="card-min h-full">
        <div class="p-5 flex justify-between">
            <div class="text-lg">
                LIFO (Last In First Out) &emsp;
            </div>
            {#if !addMode && !removeMode }    
            <button class="pl-5" on:click={(e) => {addMode = true, removeMode = false}}>
                <span  class="inline-block align-middle -mt-1">
                    <PlusCircle color="green" height={18} width={18}/>
                </span>
                add Item
            </button>
            {/if}
            {#if !removeMode && !addMode }    
            <button class="pl-5" on:click={(e) => {removeMode = true, addMode = false}}>
                <span  class="inline-block align-middle -mt-1">
                    <MinusCircle color="red" height={18} width={18}/>
                </span>
                remove Item
            </button>
            {/if}
            {#if removeMode}
            <button class="pl-5" on:click={(e) => {removeMode = false}}>
                <span  class="inline-block align-middle -mt-1">
                    <PlusCircle color="green" height={18} width={18}/>
                </span>
                cancel remove Item
            </button>
            {/if}
            {#if addMode}
            <button class="pl-5" on:click={(e) => {addMode = false}}>
                <span  class="inline-block align-middle -mt-1">
                    <MinusCircle color="red" height={18} width={18}/>
                </span>
                cancel add Item
            </button>
            {/if}
        </div>
        <div class="h-[calc(100%-8rem)] overflow-auto">
            <div class="{addMode ? "block" : "hidden"} w-[calc(100%-2.5rem)] my-5 mx-5">
                <div class="{(form?.error) ? "flex" : "hidden"} bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                    <strong class="font-bold">Failed !</strong>
                    <span class="block sm:inline ml-2">{form?.message}</span>
                    <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-interactive-supports-focus -->
                        <svg on:click={() =>{ form.error = false }} class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                    </span>
                </div>
                <form action="?/addItem" method="post" use:enhance={({form, data}) => {
                    // Before form submission to server
                    const dataForm = data
    
                    // After form submission
                    return async ({ result, update }) => {
                        if(result.type === 'success'){
                            const data = result.data;
                            addTable(data);
                            selected = null
                            form.reset();
                        }
    
                        if(result.type === 'failure'){
                            await applyAction(result)
                        }

                        update();
                    }
                }}>

                    <div class="w-full grid grid-cols-2 gap-4">
                        <div class="">
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                            <label class="block" id="kode_barang">Kode Barang<span class="text-red-400 text-xl mb-2">*</span><label>
                            <input type="hidden" name="valueBarang" bind:value={selected}>
                            <Select containerStyles="margin-top: 0.5rem;" bind:justValue={selected} name="kode_barang" items={collections} placeholder="Pilih kode barang !" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                        </div>
                        <div class="">
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                            <label class="block" id="serial_number">Serial Number<span class="text-red-400 text-xl mb-2">*</span><label>
                            <input type="text" name="serial_number" placeholder="Inputkan serial number !" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                        </div>
                        <div class="flex items-baseline mb-5 col-span-2">
                            <button type="submit" class="w-full mt-2 px-10 py-3 text-white bg-green-600 rounded-lg hover:bg-green-900">IN !</button>
                        </div>
                    </div>

                </form>
            </div>
            <div class="{removeMode ? "block" : "hidden"} w-[calc(100%-2.5rem)] my-5 mx-5">
                <div class="{(form?.error) ? "flex" : "hidden"} bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                    <strong class="font-bold">Failed !</strong>
                    <span class="block sm:inline ml-2">{form?.message}</span>
                    <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-interactive-supports-focus -->
                        <svg on:click={() =>{ form.error = false }} class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                    </span>
                </div>
                <form action="?/fifoSubmit" method="post" use:enhance={({form, data}) => {
                    // Before form submission to server
                    const dataForm = data
    
                    // After form submission
                    return async ({ result, update }) => {
                        if(result.type === 'success'){
                            const data = result.data;
                            minusTable(data);
                            selected = null
                            form.reset();
                        }
    
                        if(result.type === 'failure'){
                            await applyAction(result)
                        }

                        update();
                    }
                }}>

                    <div class="w-full grid grid-cols-2 gap-4">
                        <div class="">
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                            <label class="block" id="kode_barang">Kode Barang<span class="text-red-400 text-xl mb-2">*</span><label>
                            <input type="hidden" name="valueBarang" bind:value={selected}>
                            <Select containerStyles="margin-top: 0.5rem;" bind:justValue={selected} name="kode_barang" items={collections} placeholder="Pilih kode barang !" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                        </div>
                        <div class="flex items-baseline mb-5">
                            <button type="submit" class="w-full mt-8 px-10 py-3 text-white bg-red-600 rounded-lg hover:bg-red-900">OUT !</button>
                        </div>
                    </div>

                </form>
            </div>
            <table class="w-[calc(100%-2.5rem)] text-center mx-5">
                <thead class="">
                    <tr class="border-2 border-black">
                        <td class="pb-4 pt-4 bg-white sticky top-0 w-[20%] border-2 border-black">Kode Barang</td>
                        <td class="pb-4 pt-4 bg-white sticky top-0 w-[30%] border-2 border-black">Serial Number</td>
                        <td class="pb-4 pt-4 bg-white sticky top-0 w-1/5">Created Date</td>
                    </tr>
                </thead>
                <tbody>
                    {#each $inventoryData as inventData, i}
                        {#if inventData.details.length >= 1}
                            {#each inventData.details as detailed, j}
                                {#if j === 0}
                                    <tr class="border border-gray-200">
                                        <td class="py-3 border-r-2" rowspan="{inventData.details.length}">{inventData.kode_barang}</td>
                                        <td class="py-3 border-r-2 text-sm">{detailed.serial_number}</td>
                                        <td class="py-3 border-r-2">{normalizeDate(detailed.created_at)}</td>
                                    </tr>
                                {:else}
                                    <tr class="border border-gray-200">
                                        <td class="py-3 border-r-2 text-sm">{detailed.serial_number}</td>
                                        <td class="py-3 border-r-2">{normalizeDate(detailed.created_at)}</td>
                                    </tr>
                                {/if}
                            {/each}
                        {:else}
                            <tr class="border border-gray-200">
                                <td class="py-3 border-r-2">{inventData.kode_barang}</td>
                                <td class="py-3 border-r-2">-</td>
                                <td class="py-3 border-r-2">-</td>
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