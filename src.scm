(define basicRec
	(lambda (x)
		(if (= 0 x) "done" (basicRec (- x 1)))
	)
)

(basicRec 10)
