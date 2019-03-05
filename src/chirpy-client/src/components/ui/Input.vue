<template>
    <div class="input">
        <label>
            {{label}}
            <input
                    :type="type"
                    :value="value"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    @input="onInput($event)"

            />
        </label>
    </div>
</template>

<script>
    export default {
        model: {
            prop: 'value',
            event: 'input'
        },
        props: {
            value: {
                type: String
            },
            type: {
                type: String
            },
            placeholder: {
                type: String
            },
            label: {
                type: String
            },
            disabled: {
                type: Boolean
            }
        },
        methods: {
            onInput (event) {
                this.$emit('input',  event.target.value)
            },
        }
    }
</script>

<style scoped>
    label {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        /*border: 1px solid black;*/
        color: purple;
    }
    input {
        margin-top: 0.5em;
        width: 95%;
        border: none;
        /*border: 1px solid black;*/
        outline: none;
        font-size: 1em;
    }

    input:disabled {
        background-color: white;
    }
    
</style>