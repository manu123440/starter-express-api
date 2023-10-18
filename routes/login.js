const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
	try {
		let message = req.flash('error');
		// console.log(message);

		if (message.length > 0) {
			message = message[0];
		}
		else {
			message = null;
		}

		return res.render('login', {
			errorMessage: message,
			oldInput: {
				email: '',
				password: ''
			}
		});
	}
	catch(error) {
		// console.log(error);
		return res.json({
			'message': "Page not found..."
		})
	}
})

module.exports = router;