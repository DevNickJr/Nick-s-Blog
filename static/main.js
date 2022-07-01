const bodyEl = document.getElementById('body');
const reward = document.querySelectorAll('.reward');
const modalItem = document.querySelectorAll('.selected');
const continueBtn = document.querySelectorAll('.continue');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const thankYou = document.getElementById('thank-you');
const thankYouBtn = document.getElementById('thanks-btn');
const modally = modalItem
// modal
reward.forEach((i) => {
    i.addEventListener('click', () => {
        bodyEl.style.overflowY = 'hidden';
        modal.style.display = 'block'
        modal.focus()
    })
})

// modal selected
modalItem.forEach((i) => {
    i.addEventListener('click', () => {

        for (let mode of modally) {
            mode.style.border = 'none';
            mode.querySelector('.pledge-selected').style.display = 'none'
            // mode.lastElementChild.style.display = 'none'
        }
        i.querySelector('input').checked = 'true';   
        i.style.border = '2px solid hsl(176, 50%, 47%)';
        i.querySelector('.pledge-selected').style.display = 'block'
        // i.lastElementChild.style.display = 'block'
    })
})

closeModal.addEventListener('click', () => {
    modal.style.display = 'none'
    bodyEl.style.overflowY = 'auto';
})

continueBtn.forEach(el => {
    el.addEventListener('click', () => {
        modal.style.display = 'none'
        bodyEl.style.overflowY = 'hidden';
        thankYou.style.display = 'block'
    })
})

thankYouBtn.addEventListener('click', () => {
    thankYou.style.display = 'none'
    bodyEl.style.overflowY = 'auto';
})