<template>
    <div class="byte-splitter">
        <h2>红白机单字节拆分器</h2>

        <div class="form-group">
            <label for="input-value">输入数值：</label>
            <input
                id="input-value"
                type="number"
                v-model.number="inputValue"
                min="0"
                placeholder="请输入一个正整数"
            />
        </div>

        <div class="result" v-if="inputValue !== '' && inputValue !== null && !isNaN(inputValue)">
            <template v-if="inputValue > 0xFFFFFF">
                <div class="unsupported">
                    <p>不支持超过 3 个字节（{{ 0xFFFFFF }}）的数值。</p>
                </div>
            </template>
            <template v-else>
                <h3>拆分结果</h3>
                <p class="split-formula">
                    {{ inputValue }}
                    = 65536 × <span class="byte-b2">{{ byte2 }}</span>
                    + 256 × <span class="byte-b1">{{ byte1 }}</span>
                    + <span class="byte-b0">{{ byte0 }}</span>
                </p>
                <table class="byte-table">
                    <tr>
                        <th></th>
                        <th>十进制</th>
                        <th>十六进制</th>
                    </tr>
                    <tr>
                        <td>字节 0 (低)</td>
                        <td class="cell-num">{{ byte0 }}</td>
                        <td><code>${{ hex0 }}</code></td>
                    </tr>
                    <tr>
                        <td>字节 1 (中)</td>
                        <td class="cell-num">{{ byte1 }}</td>
                        <td><code>${{ hex1 }}</code></td>
                    </tr>
                    <tr>
                        <td>字节 2 (高)</td>
                        <td class="cell-num">{{ byte2 }}</td>
                        <td><code>${{ hex2 }}</code></td>
                    </tr>
                    <tr class="full-value">
                        <td>完整值</td>
                        <td class="cell-num">{{ inputValue }}</td>
                        <td><code>${{ fullHex }}</code></td>
                    </tr>
                </table>

                <div class="notes" v-if="inputValue > 0xFFFF">
                    <p>该值超过 16 位（65535），需要使用 3 个字节。</p>
                </div>
                <div class="notes" v-else-if="inputValue > 0xFF">
                    <p>该值超过 8 位（255），需要使用 2 个字节。</p>
                </div>
                <div class="notes" v-else>
                    <p>该值在 8 位以内，只需 1 个字节。</p>
                </div>
            </template>
        </div>

        <div class="common-refs">
            <h3>常用数值参考（小端字节序）</h3>
            <table class="byte-table">
                <tr>
                    <th>十进制</th>
                    <th>拆分结果 (低→高)</th>
                    <th>十六进制</th>
                </tr>
                <tr v-for="item in commonValues" :key="item.dec">
                    <td class="cell-num">{{ item.dec }}</td>
                    <td class="cell-bytes">
                        <span v-for="(b, i) in item.bytes" :key="i" class="byte-chip">{{ b }}</span>
                    </td>
                    <td><code>${{ item.hex }}</code></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    setup() {
        const inputValue = ref(0);

        const byte2 = computed(() => Math.floor(inputValue.value / 65536));
        const byte1 = computed(() => Math.floor((inputValue.value % 65536) / 256));
        const byte0 = computed(() => inputValue.value % 256);

        const toHex = (num, pad = 2) => num.toString(16).toUpperCase().padStart(pad, '0');

        const hex2 = computed(() => toHex(byte2.value));
        const hex1 = computed(() => toHex(byte1.value));
        const hex0 = computed(() => toHex(byte0.value));
        const fullHex = computed(() => toHex(inputValue.value, 6));

        const splitBytes = (num) => {
            const b = [];
            let n = num;
            while (n > 0) {
                b.push(n % 256);
                n = Math.floor(n / 256);
            }
            return b.length ? b : [0];
        };

        const commonValues = [
            { dec: 0, bytes: splitBytes(0), hex: toHex(0, 6) },
            { dec: 1, bytes: splitBytes(1), hex: toHex(1, 6) },
            { dec: 127, bytes: splitBytes(127), hex: toHex(127, 6) },
            { dec: 128, bytes: splitBytes(128), hex: toHex(128, 6) },
            { dec: 255, bytes: splitBytes(255), hex: toHex(255, 6) },
            { dec: 256, bytes: splitBytes(256), hex: toHex(256, 6) },
            { dec: 512, bytes: splitBytes(512), hex: toHex(512, 6) },
            { dec: 999, bytes: splitBytes(999), hex: toHex(999, 6) },
            { dec: 1024, bytes: splitBytes(1024), hex: toHex(1024, 6) },
            { dec: 4096, bytes: splitBytes(4096), hex: toHex(4096, 6) },
            { dec: 65535, bytes: splitBytes(65535), hex: toHex(65535, 6) },
            { dec: 65536, bytes: splitBytes(65536), hex: toHex(65536, 6) },
        ];

        return {
            inputValue,
            byte2,
            byte1,
            byte0,
            hex2,
            hex1,
            hex0,
            fullHex,
            commonValues,
        };
    }
};
</script>

<style scoped>
.byte-splitter {
    max-width: 680px;
    margin: 0 auto;
    padding: 20px;
    border: 2px solid #e74c3c;
    border-radius: 8px;
    font-family: 'Courier New', Courier, monospace;
    background: linear-gradient(135deg, #fef9f0 0%, #fff5e6 100%);
    box-shadow: 4px 4px 0 #c0392b;
}

.byte-splitter h2 {
    color: #c0392b;
    text-align: center;
    font-size: 1.3em;
    margin-top: 0;
    margin-bottom: 20px;
    border-bottom: 2px solid #e74c3c;
    padding-bottom: 10px;
}

.form-group {
    margin-bottom: 20px;
    text-align: center;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555;
}

.form-group input {
    width: 80%;
    padding: 10px;
    font-size: 1.2em;
    font-family: 'Courier New', Courier, monospace;
    border: 2px solid #ccc;
    border-radius: 4px;
    text-align: center;
    outline: none;
    transition: border-color 0.3s;
}

.form-group input:focus {
    border-color: #e74c3c;
}

.result {
    margin-top: 20px;
    padding: 15px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #eee;
}

.result h3 {
    color: #c0392b;
    text-align: center;
    margin-top: 0;
    margin-bottom: 15px;
}

.split-formula {
    text-align: center;
    font-size: 1.1em;
    padding: 10px;
    background: #fdf2f2;
    border-radius: 4px;
    margin-bottom: 15px;
    word-break: break-all;
}

.byte-b2 {
    color: #8e44ad;
    font-weight: bold;
}

.byte-b1 {
    color: #e67e22;
    font-weight: bold;
}

.byte-b0 {
    color: #2980b9;
    font-weight: bold;
}

.byte-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9em;
}

.byte-table th {
    background: #c0392b;
    color: #fff;
    padding: 10px 12px;
    text-align: center;
}

.byte-table td {
    padding: 10px 12px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

.cell-num {
    font-family: 'Courier New', Courier, monospace;
    font-size: 1em;
    letter-spacing: 0.5px;
}

.cell-bytes {
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;
}

.byte-chip {
    display: inline-block;
    background: #fdf2f2;
    border: 1px solid #e74c3c;
    border-radius: 4px;
    padding: 2px 8px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
    color: #c0392b;
}

.byte-table tr:nth-child(even) {
    background: #fdf2f2;
}

.byte-table tr:nth-child(odd) {
    background: #fff;
}

.byte-table tr.full-value td {
    font-weight: bold;
    background: #fff5e6;
}

.byte-table code {
    background: #f4f4f4;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', Courier, monospace;
}

.notes {
    margin-top: 15px;
    padding: 10px;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 4px;
    color: #856404;
    font-size: 0.9em;
}

.unsupported {
    text-align: center;
    padding: 20px;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 4px;
    color: #856404;
    font-size: 1.1em;
}

.common-refs {
    margin-top: 24px;
    padding: 15px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #eee;
}

.common-refs h3 {
    color: #c0392b;
    text-align: center;
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1em;
}
</style>
