document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.quantity-input').forEach(quantityInputWrapper => {
        const inputField = quantityInputWrapper.querySelector('.moq-input');
        const minusButton = quantityInputWrapper.querySelector('.moq-minus');
        const plusButton = quantityInputWrapper.querySelector('.moq-plus');
        const moq = parseInt(inputField.value);
        function updateMinusButtonState() {
            if (parseInt(inputField.value) <= moq) {
                minusButton.disabled = true;
            } else {
                minusButton.disabled = false;
            }
        }
        updateMinusButtonState();
        inputField.addEventListener('input', () => {
            updateMinusButtonState();
            handleManualInputReversion();
        });
minusButton.addEventListener('click', () => {
    if (!isNaN(currentValue) && currentValue > moq) {
        inputField.value = currentValue - 1;
        updateMinusButtonState();
    }
});
plusButton.addEventListener('click', () => {
    let currentValue = parseInt(inputField.value);
    if (!isNaN(currentValue)) {
        inputField.value = currentValue + 1;
        updateMinusButtonState();
    }
});
function handleManualInputReversion() {
    let currentValue = parseInt(inputField.value);
    if (isNaN(currentValue) || currentValue < moq) {
        inputField.value = moq;
        inputField.dispatchEvent(new Event('change', { bubbles: true }));
        updateMinusButtonState();
    }
}
        inputField.addEventListener('change', handleManualInputReversion);
    });
    const input = document.querySelector('.moq-input');
  const tooltip = document.getElementById('tooltip-1');
  
  function checkInput() {
    const moq = parseInt(input.dataset.moq);
    const val = parseInt(input.value);
    if (val < moq) {
      tooltip.textContent = `This item has a minimum of ${moq}.`;
      tooltip.classList.add('show');
    } else {
      tooltip.classList.remove('show');
    }
  }
  
  input.addEventListener('input', checkInput);
  input.addEventListener('blur', () => {
    setTimeout(() => tooltip.classList.remove('show'), 1500);
  });
  
  checkInput();
});