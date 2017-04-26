(define basicRec
	(lambda (x)
		(if (= x 0) "done" (basicRec (- x 1)))
	)
)

(basicRec 10)
