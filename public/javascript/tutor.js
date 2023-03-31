const label = document.querySelector('#tutorLabel')
const saveBtn = document.querySelector('#saveTutor')
const cancelBtn = document.querySelector('#cancelTutorModal')
const modal = document.querySelector('#tutorModal')
const form = modal.querySelector('form')
const DAY_MAP = {
  "sunday": 0,
  "monday": 1,
  "tuesday": 2,
  "wednesday": 3,
  "thursday": 4,
  "friday": 5,
  "saturday": 6,
}

const save = async (event) => {
  const tutorId = form.elements.tutorId.value
  const payload = {
    description: form.elements.tutorDescription.value,
    duration: +form.elements.tutorDuration.value,
    link: form.elements.tutorLink.value,
  }
  const serviceAvailability = new Set()
  form.elements.serviceAvailability.forEach(item => {
    if (item.checked) serviceAvailability.add(+item.value)
  })
  payload['serviceAvailability'] = Array.from(serviceAvailability)
  let method = 'post'
  let url = '/tutors'
  if (form.elements.dataType.value !== 'new') {
    method = 'put'
    url = `${url}/${tutorId}`
  }
  console.log(url)
  const { status } = await axios({ data: payload, url, method })
  if (status === 200) {
    cancelBtn.click()
    window.location.reload()
  }
}

const setModalValue = (event) => {
  const btn = event.relatedTarget
  const labelName = btn.getAttribute('data-bs-tutor-label')
  const tutorId = btn.getAttribute('data-bs-tutor-id')
  const tutorDescription = btn.getAttribute('data-bs-tutor-description')
  const tutorDuration = btn.getAttribute('data-bs-tutor-duration')
  const tutorLink = btn.getAttribute('data-bs-tutor-link')
  const serviceAvailability = btn.getAttribute('data-bs-tutor-service-availability')
  const dataType = btn.getAttribute('data-bs-data-type')
  const availability = JSON.parse(serviceAvailability)
  label.textContent = labelName
  form.elements.tutorId.value = tutorId
  form.elements.tutorDescription.value = tutorDescription
  form.elements.tutorDuration.value = +tutorDuration
  form.elements.tutorLink.value = tutorLink
  form.elements.dataType.value = dataType
  Object.keys(DAY_MAP).forEach(name => {
    const wday = DAY_MAP[name]
    form.elements[name].checked = availability.includes(wday)
  })
}

saveBtn.addEventListener('click', save)
modal.addEventListener('show.bs.modal', setModalValue)