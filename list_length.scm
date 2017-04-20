(define listLength
	(lambda (passedlist)
		(let ((i 1))
			(define listLengthLoop
				(lambda (l)
					(cond
						((null? '(cdr l)) i)
						(else (set! i (+ i 1)) (listLengthLoop (cdr l)))
					)
				)
			)
			(listLengthLoop passedlist)
		)
	)
)
