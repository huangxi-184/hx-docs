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
    max-width: 520px;
    margin: 1.5rem auto;
    padding: 1.75rem;
    border-radius: 12px;
    border: 1px solid var(--border-color, #e2e8f0);
    background: var(--bg-color, #ffffff);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s, border-color 0.2s;
}

.expiry-calculator:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.expiry-calculator h2 {
    font-size: 1.25rem;
    margin: 0 0 1.25rem;
    padding-bottom: 0.6rem;
    border-bottom: 2px solid var(--theme-color, #3eaf7c);
    color: var(--text-color, #2c3e50);
}

.form-group {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--text-color, #34495e);
    white-space: nowrap;
    min-width: 80px;
}

.form-group input[type="date"],
.form-group input[type="number"] {
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--border-color, #d1d5db);
    border-radius: 6px;
    font-size: 0.9rem;
    color: var(--text-color, #2c3e50);
    background: var(--bg-color, #fff);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input[type="date"] {
    flex: 1;
    min-width: 140px;
}

.form-group input[type="number"] {
    width: 80px;
}

.form-group input:focus {
    border-color: var(--theme-color, #3eaf7c);
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.15);
}

.form-group select {
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--border-color, #d1d5db);
    border-radius: 6px;
    font-size: 0.9rem;
    color: var(--text-color, #2c3e50);
    background: var(--bg-color, #fff);
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group select:focus {
    border-color: var(--theme-color, #3eaf7c);
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.15);
}

button {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.65rem 1.25rem;
    background: var(--theme-color, #3eaf7c);
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}

button:hover {
    background: var(--theme-color-light, #2d8f5e);
    box-shadow: 0 2px 8px rgba(62, 175, 124, 0.3);
}

button:active {
    transform: scale(0.98);
}

.result {
    margin-top: 1.25rem;
    padding: 1rem 1.25rem;
    border-radius: 8px;
    background: var(--bg-secondary, #f7f8fa);
    border: 1px solid var(--border-color, #e2e8f0);
    animation: fadeInUp 0.3s ease;
}

.result h3 {
    font-size: 1rem;
    margin: 0 0 0.75rem;
    color: var(--text-color, #2c3e50);
}

.result p {
    margin: 0.35rem 0;
    font-size: 0.9rem;
    color: var(--text-color-light, #4a5568);
}

.expired {
    color: #e53e3e;
    font-weight: 600;
}

.not-expired {
    color: #38a169;
    font-weight: 600;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>