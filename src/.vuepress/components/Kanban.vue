<template>
    <div class="expiry-calculator">
        <h2>保质期计算器</h2>

        <div class="form-group">
            <label for="production-date">生产日期：</label>
            <input type="date" id="production-date" v-model="productionDate">
        </div>

        <div class="form-group">
            <label>保质期：</label>
            <input type="number" v-model.number="expiryValue" min="1">
            <select v-model="expiryUnit">
                <option value="days">天</option>
                <option value="months">月</option>
                <option value="years">年</option>
            </select>
        </div>

        <button @click="calculate">计算</button>

        <div class="result" v-if="result">
            <h3>计算结果</h3>
            <p>生产日期：{{ formatDate(productionDate) }}</p>
            <p>过期日期：{{ formatDate(result.expiryDate) }}</p>
            <p>状态：<span :class="{ 'expired': result.isExpired, 'not-expired': !result.isExpired }">
                    {{ result.isExpired ? '已过期' : '未过期' }}
                </span></p>
            <p v-if="result.isExpired">已过期 {{ Math.abs(result.daysRemaining) }} 天</p>
            <p v-else>距离过期还有 {{ result.daysRemaining }} 天</p>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const productionDate = ref('');
        const expiryValue = ref(1);
        const expiryUnit = ref('days');
        const result = ref(null);

        const calculate = () => {
            if (!productionDate.value) {
                alert('请选择生产日期');
                return;
            }

            const production = new Date(productionDate.value);
            const expiryDate = new Date(production);

            switch (expiryUnit.value) {
                case 'days':
                    expiryDate.setDate(expiryDate.getDate() + expiryValue.value);
                    break;
                case 'months':
                    expiryDate.setMonth(expiryDate.getMonth() + expiryValue.value);
                    break;
                case 'years':
                    expiryDate.setFullYear(expiryDate.getFullYear() + expiryValue.value);
                    break;
            }

            const today = new Date();
            const timeDiff = expiryDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            result.value = {
                expiryDate: expiryDate,
                isExpired: daysDiff < 0,
                daysRemaining: daysDiff
            };
        };

        const formatDate = (date) => {
            if (!date) return '';
            const d = new Date(date);
            return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
        };

        return {
            productionDate,
            expiryValue,
            expiryUnit,
            result,
            calculate,
            formatDate
        };
    }
};
</script>

<style scoped>
.expiry-calculator {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: Arial, sans-serif;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: inline-block;
    width: 100px;
}

input[type="date"],
input[type="number"] {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-left: 10px;
}

button {
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

.result {
    margin-top: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 4px;
}

.expired {
    color: red;
    font-weight: bold;
}

.not-expired {
    color: green;
    font-weight: bold;
}
</style>