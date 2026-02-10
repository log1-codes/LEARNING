#include <iostream>
using namespace std;

int main() {
    int N;
    cin >> N;

    long long first, x;
    cin >> first;   

    bool beautiful = true;

    for (int i = 1; i < N; i++) {
        cin >> x;
        if (x != first) {
            beautiful = false;
        }
    }
    if (beautiful)
        cout << "YES";
    else
        cout << "NO";

    return 0;
}
