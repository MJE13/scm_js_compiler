(define listLength
	(lambda (passedlist)
		(let ((i 1) (str "i am the very model of a modern major general"))
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
