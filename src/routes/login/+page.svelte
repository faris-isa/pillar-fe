<script lang="ts">
    import { onMount } from "svelte";
    import "../../app.css";

    onMount(async ()=>{
        
    })
    export let form: any;
</script>

<style>
    .toosmall{
        @apply hidden
    }
    @media only screen and (max-height: 868px) {
        .toosmall{
            @apply flex
        }
        .preventsmall{
            @apply hidden
        }
    }
</style>
<div class="lg:hidden h-screen flex z-20 justify-center items-center">
    <span>Sorry we doesn't support Mobile Version</span>
</div>
<div class="toosmall lg:opacity-100 opacity-0 lg:relative absolute top-0  h-screen z-10 justify-center items-center">
    <span>Your screen height is too small, please zoom out (ctrl + -)</span>
</div>

<div class="preventsmall lg:flex flex-col hidden justify-center items-center h-screen">
    <div class="px-8 py-6 mt-4 text-left bg-white drop-shadow-2xl rounded-lg">
        <div class="flex justify-center">
            <img src="/logo.png" class="h-20" alt="">
        </div>
        <h3 class="text-2xl font-bold text-center">Login to your account</h3>
        <div class="{(form?.error) ? "flex" : "hidden"} bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <div class="flex flex-col">
                <strong class="w-full font-bold">Failed ({form?.statusCode}) </strong>
                <span class="block sm:inline">{form?.message}</span>
            </div>
            <div class="">
                <span class="flex items-center absolute top-0 bottom-0 right-0 px-4 py-3">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <svg on:click={() =>{ form.error = false }} class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
        </div>
        <form method="POST">
            <div class="mt-4">
                <div>
                    <label class="block" for="username">Username<label>
                    <input type="text" name="username" placeholder="Username" value="{form?.username ?? 'japaneseDeer'}" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                </div>
                <div class="mt-4">
                    <label class="block">Password<label>
                    <input type="password" name="password" placeholder="Password" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                </div>
                <div class="flex items-baseline justify-between">
                    <button class="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</button>
                    <!-- <a href="#" class="text-sm text-blue-600 hover:underline">Forgot password?</a> -->
                </div>
            </div>
        </form>
    </div>
</div>
