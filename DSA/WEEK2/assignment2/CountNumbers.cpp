#include <iostream>
using namespace std;

int main() {
    int N;
    cin >> N;

    long long x;
    int positive = 0, negative = 0, even = 0, odd = 0;

    for (int i = 0; i < N; i++) {
        cin >> x;

        if (x > 0) positive++;
        else if (x < 0) negative++;

        if (x % 2 == 0) even++;
        else odd++;
    }

    cout << positive << endl;
    cout << negative << endl;
    cout << even << endl;
    cout << odd << endl;

    return 0;
}
